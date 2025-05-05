import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(req:Request){
    await dbConnect();
    try {
        const users = await User.find().select("-password");
        if(!users){
            return NextResponse.json({message:"No users found"}, {status:404});
        }
        return NextResponse.json({users}, {status:200});
    } catch (error) {
        return NextResponse.json({message:"Internal server error"}, {status:500});
    }
}