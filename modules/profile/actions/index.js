"use server";
import { currentUser } from "@clerk/nextjs/server";
import {db} from "@/lib/db"

export const getCurrentUserData = async () => {
  try {
    const user = await currentUser();
    const data = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        submissions: true,
        solvedProblems: true,
        playlists: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
};
