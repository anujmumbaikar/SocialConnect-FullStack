import { dbConnect } from "@/lib/dbConnect";
import Saved from "@/models/saved.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "You need to sign in first" }, { status: 401 });
    }
    const { postId } = params;
    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }
    const userId = session.user._id;
    const existingSaved = await Saved.findOne({
      userId,
      postId,
    });
    if (existingSaved) {
      await existingSaved.deleteOne();
      return NextResponse.json({ message: "Unsaved successfully" }, { status: 200 });
    }
    const savedItem = await Saved.create({
      userId,
      postId,
    });
    return NextResponse.json({ message: "Saved successfully", savedItem }, { status: 201 });
  } catch (error) {
    console.error("Error toggling save:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
