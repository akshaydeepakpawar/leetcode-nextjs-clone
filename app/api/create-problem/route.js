import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";

import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    // Basic validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate test cases
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 },
      );
    }

    // Validate reference solutions
    if (!referenceSolutions || typeof referenceSolutions !== "object") {
      return NextResponse.json(
        {
          error:
            "Reference solutions must be provided for all supported languages",
        },
        { status: 400 },
      );
    }

    function generateJSWrapper(solutionCode) {
      if (
        solutionCode.includes("readline") ||
        solutionCode.includes("fs.readFileSync")
      ) {
        return solutionCode;
      }

      return `
${solutionCode}

const fs = require('fs');
let input = fs.readFileSync(0, 'utf-8').trim();

// Try JSON parsing
try {
  input = JSON.parse(input);
} catch (e) {}

// 🔥 Detect function name dynamically
const fnMatch = solution.toString().match(/function\s+([a-zA-Z0-9_]+)/);
const fnName = fnMatch ? fnMatch[1] : "solution";

const fn = globalThis[fnName] || solution;

if (Array.isArray(input)) {
  console.log(fn(...input));
} else {
  console.log(fn(input));
}
`;
    }

    function generatePythonWrapper(solutionCode) {
      if (solutionCode.includes("if __name__")) {
        return solutionCode;
      }

      return `
${solutionCode}

import sys, json

input_data = sys.stdin.read().strip()

try:
    input_data = json.loads(input_data)
except:
    pass

fn = "solution"
sol = Solution()

if isinstance(input_data, list):
    result = getattr(sol, fn)(*input_data)
else:
    result = getattr(sol, fn)(input_data)

if isinstance(result, bool):
    print(str(result).lower())
else:
    print(result)
`;
    }
    function generateJavaWrapper(solutionCode) {
      if (solutionCode.includes("public static void main")) {
        return solutionCode;
      }

      const isIntParam = solutionCode.includes("solution(int");

      return `
import java.util.*;

class Main {
${solutionCode}

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String input = sc.nextLine().trim();

    Main obj = new Main();

    ${
      isIntParam
        ? `
    int intInput = Integer.parseInt(input);
    System.out.println(obj.solution(intInput));
    `
        : `
    System.out.println(obj.solution(input));
    `
    }

    sc.close();
  }
}
`;
    }

    function generateWrapper(language, solutionCode) {
      if (language === "JAVASCRIPT") {
        return generateJSWrapper(solutionCode);
      }

      if (language === "PYTHON") {
        return generatePythonWrapper(solutionCode);
      }

      if (language === "JAVA") {
        return generateJavaWrapper(solutionCode);
      }

      return solutionCode;
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // Step 2.1: Get Judge0 language ID for the current language
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return NextResponse.json(
          { error: `Unsupported language: ${language}` },
          { status: 400 },
        );
      }
      console.log("LANGUAGE:", language);
      console.log("SOURCE CODE:\n", solutionCode);

      // Step 2.2: Prepare Judge0 submissions for all test cases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: generateWrapper(language, solutionCode),
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      console.log("FINAL CODE:\n", submissions[0].source_code);

      // Step 2.3: Submit all test cases in one batch
      let submissionResults;
      try {
        submissionResults = await submitBatch(submissions);
      } catch (err) {
        console.error("Judge0 submit error:", err);
        return NextResponse.json(
          { error: "Judge0 submission failed" },
          { status: 500 },
        );
      }

      // Step 2.4: Extract tokens from response
      const tokens = submissionResults.map((res) => res.token);

      // Step 2.5: Poll Judge0 until all submissions are done
      const results = await pollBatchResults(tokens);

      // Step 2.6: Validate that each test case passed (status.id === 3)
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const clean = (s) => (s ?? "").trim();

        const actualOutput = clean(result.stdout);
        const expectedOutput = clean(submissions[i].expected_output);

        console.log(`Test case ${i + 1} details:`, {
          input: submissions[i].stdin,
          expectedOutput,
          actualOutput,
          status: result.status,
          language: language,
          error: result.stderr || result.compile_output,
        });

        if (result.status.id !== 3 || actualOutput !== expectedOutput) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i].stdin,
                expectedOutput,
                actualOutput,
                error: result.stderr || result.compile_output,
              },
              details: result,
            },
            { status: 400 },
          );
        }
      }
    }

    // Step 3: Save the problem in the database after all validations pass
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json(
      { error: "Failed to save problem to database" },
      { status: 500 },
    );
  }
}
