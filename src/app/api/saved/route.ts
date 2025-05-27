import { dbConnect } from "@/lib/dbConnect";
import Saved from "@/models/saved.model";
import Post from "@/models/post.model";
import Reel from "@/models/reels.model";
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
    const savedItems = await Saved.find({ userId });
    const savedContent = await Promise.all(
      savedItems.map(async (item) => {
        const post = item.postId ? await Post.findById(item.postId).select("postUrl caption likes") : null;
        const reel = item.reelId ? await Reel.findById(item.reelId).select("reelUrl caption views") : null;

        return {
          ...item.toObject(),
          postId: post,
          reelId: reel,
        };
      })
    );

    return NextResponse.json({ savedContent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved content:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}