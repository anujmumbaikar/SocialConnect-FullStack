import mongoose from "mongoose";
import { NextResponse,NextRequest } from "next/server";
import User from "@/models/user.model";
import Post from "@/models/post.model";
import { dbConnect } from "@/lib/dbConnect";
export async function GET(req:NextRequest,{params}:{params:{postId:string}}) {
    try {
        dbConnect();
        const { postId } = params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return NextResponse.json({error:"Invalid Post ID"}, {status:400})
        }
        const post = await Post.findById(postId).populate("userId","username avatar");
        if (!post) {
            return NextResponse.json({error:"Post not found"}, {status:404})
        }
        return NextResponse.json(post, {status:200})
        
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}