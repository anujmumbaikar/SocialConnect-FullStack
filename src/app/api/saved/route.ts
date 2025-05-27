import { dbConnect } from "@/lib/dbConnect";
import Saved from "@/models/saved.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "You need to sign in first" }, { status: 401 });
    }

    const userId = session.user._id;
    const savedContent = await Saved.find({ userId })
      .populate("postId", "postUrl caption likes") 
      .populate("reelId", "reelUrl caption views") 
      .exec();

    return NextResponse.json({ savedContent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved content:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}