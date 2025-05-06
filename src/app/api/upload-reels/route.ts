import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import Reel from "@/models/reels.model";
export async function POST(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reelUrl, caption, transformation ,title } = body;

    try {
        const newReel = await Reel.create({
            reelUrl,
            caption,
            title,
            transformation,
            userId: session.user._id, // or session.user.id depending on your session object
        });

        return NextResponse.json(newReel, { status: 201 });
    } catch (err) {
        console.error("DB Save Error:", err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
