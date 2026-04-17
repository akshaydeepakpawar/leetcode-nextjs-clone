import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
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

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 },
      );
    }

    const playlistData = await db.playlist.create({
      where: {
        data: {
          name,
          description,
          userId: dbUser.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create playlist",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
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

    const playlist= await db.playlist.findMany({
        where:{userId:dbUser.id},
        include:{
            problems:{
                select:{
                    id:true,
                    title:true,
                    difficulty:true
                }
            }
        },
        orderBy:{createdAt:"desc"}
    })
    return NextResponse.json({
        success:true,
        playlists
    })
  } catch (error) {
    console.error("Error fetching playlists:",error);
    return NextResponse.json({
        success:false,error:"Failed to fetch playlists"
    },{status:500})
  }
}
