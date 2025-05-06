import { dbConnect } from "@/lib/dbConnect";
import Reel from "@/models/reels.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const reels = await Reel.find().populate("userId", "name username avatar").sort({ createdAt: -1 });
    return NextResponse.json( {reels} );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}