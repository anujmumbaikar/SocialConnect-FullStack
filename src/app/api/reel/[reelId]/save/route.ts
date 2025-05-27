import { dbConnect } from "@/lib/dbConnect";
import Saved from "@/models/saved.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { reelId: string } }) {
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

    // Check if the save already exists
    const existingSaved = await Saved.findOne({
      userId,
      reelId,
    });

    if (existingSaved) {
      // If already saved, delete it (unsave)
      await existingSaved.deleteOne();
      return NextResponse.json({ message: "Unsaved successfully" }, { status: 200 });
    }

    // If not saved, create a new save
    const savedItem = await Saved.create({
      userId,
      reelId,
    });

    return NextResponse.json({ message: "Saved successfully", savedItem }, { status: 201 });
  } catch (error) {
    console.error("Error toggling save:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
