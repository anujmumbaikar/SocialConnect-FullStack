import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

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
        let user = await User.findOne({ username })
            .select("-password -__v")
            .lean();
        if (!user) {
            user = await User.findOne({ 
                email: new RegExp(`^${username}@`, 'i') 
            })
            .select("-password -__v")
            .lean();
            if (!user) {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }
        }
        
        // Success response
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        // Log the actual error for server debugging
        console.error("Error in get-user-data API:", error);
        
        // Return appropriate error response to client
        return NextResponse.json(
            { 
                message: "Internal server error", 
                details: process.env.NODE_ENV === 'development' ? error.message : undefined 
            },
            { status: 500 }
        );
    }
}