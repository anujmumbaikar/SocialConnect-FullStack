
import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/like.model";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
  }
  const userId = session?.user._id;
  if (!userId) {
    return NextResponse.json({ message: "You need to sign in first" }, { status: 401 });
  }

  const existingLike = await Like.findOne({ targetId: postId, userId, targetType: "Post" });

  if (existingLike) {
    existingLike.isLike = !existingLike.isLike;
    await existingLike.save();
    return NextResponse.json({
      message: existingLike.isLike ? "Liked" : "Unliked",
    }, { status: 200 });
  }

  await Like.create({ targetId: postId, userId, targetType: "Post", isLike: true });
  return NextResponse.json({ message: "Liked" }, { status: 201 });
}
