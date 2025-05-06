import { dbConnect } from "@/lib/dbConnect";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find().populate("userId", "name username avatar").sort({ createdAt: -1 });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}