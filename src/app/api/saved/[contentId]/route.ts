import { dbConnect } from "@/lib/dbConnect";
import Saved from "@/models/saved.model";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "You need to sign in first" }, { status: 401 });
    }

    const userId = session.user._id;
    const { postId, reelId } = await request.json();

    if (!postId && !reelId) {
      return NextResponse.json({ message: "Either postId or reelId is required" }, { status: 400 });
    }
    const existingSaved = await Saved.findOne({
      userId,
      ...(postId ? { postId } : { reelId }),
    });
    if (existingSaved) {
      await existingSaved.deleteOne();
      return NextResponse.json({ message: "Unsaved successfully" }, { status: 200 });
    } else {
      const savedItem = await Saved.create({
        userId,
        postId: postId || null,
        reelId: reelId || null,
      });
      return NextResponse.json({ message: "Saved successfully", savedItem }, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling save:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
