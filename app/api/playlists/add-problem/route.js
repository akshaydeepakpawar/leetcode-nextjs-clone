import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const { problemId, playlistId } = await request.json();

    if (!problemId || !playlistId) {
      return NextResponse.json(
        {
          success: false,
          error: "Problem ID or playlist ID are required",
        },
        { status: 400 },
      );
    }

    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: dbUser.id,
      },
    });

    if (!playlist) {
      return NextResponse.json(
        {
          success: false,
          error: "Playlist not fount or unauthorized",
        },
        { status: 400 },
      );
    }

    const problemInPlaylist = await db.problemInPlaylist.create({
      data: {
        problemId,
        playlistId,
      },
    });
    return NextResponse.json({
      success: true,
      data: problemInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add problem to playlist",
      },
      { status: 500 },
    );
  }
}
