import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Post from "@/models/post.model";
import Reel from "@/models/reels.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        if (!username) {
            return NextResponse.json(
                { message: "Username parameter is required" },
                { status: 400 }
            );
        }
        const user = await User.findOne({ username })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const userId = user._id;

        const posts = await Post.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $sort: { createdAt: -1 } 
            }
        ]);

        // Fetch reels for this user
        const reels = await Reel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        return NextResponse.json({ 
            user,
            posts,
            reels
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { 
                message: "Internal server error", 
                details: process.env.NODE_ENV === 'development' ? error.message : undefined 
            },
            { status: 500 }
        );
    }
}