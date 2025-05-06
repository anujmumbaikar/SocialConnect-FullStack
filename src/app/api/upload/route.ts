import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Post from "@/models/post.model";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { postUrl, caption, transformation } = body;

    try {
        const newPost = await Post.create({
            postUrl,
            caption,
            transformation,
            userId: session.user._id, // or session.user.id depending on your session object
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (err) {
        console.error("DB Save Error:", err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
