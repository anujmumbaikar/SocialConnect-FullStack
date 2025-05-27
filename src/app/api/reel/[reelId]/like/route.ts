import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/like.model";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest, { params }: { params: { reelId: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "You need to sign in first" }, { status: 401 });
    }

    const { reelId } = params;

    if (!reelId) {
      return NextResponse.json({ message: "Reel ID is required" }, { status: 400 });
    }

    const userId = session.user._id;

    // Check if the like already exists
    const existingLike = await Like.findOne({
      targetId: reelId,
      userId,
      targetType: "Reel",
    });

    if (existingLike) {
      // Delete the like document (unlike)
      await existingLike.deleteOne();
      return NextResponse.json({ message: "Unliked successfully" }, { status: 200 });
    }

    // If no like exists, create a new like
    await Like.create({
      targetId: reelId,
      userId,
      targetType: "Reel",
      isLike: true,
    });

    return NextResponse.json({ message: "Liked successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
