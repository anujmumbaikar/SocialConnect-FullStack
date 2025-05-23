import mongoose from "mongoose";
import { NextResponse,NextRequest } from "next/server";
import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import Reel from "@/models/reels.model";
export async function GET(req:NextRequest,{params}:{params:{reelId:string}}) {
    try {
        dbConnect();
        const { reelId } = params;
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return NextResponse.json({error:"Invalid Post ID"}, {status:400})
        }
        const reel = await Reel.findById(reelId).populate("userId","username avatar");
        if (!reel) {
            return NextResponse.json({error:"Post not found"}, {status:404})
        }
        return NextResponse.json(reel, {status:200})
        
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}