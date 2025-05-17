import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = session.user._id;
        console.log("Session user ID:", userId);
        
        if (!userId) {
            if (session.user.email) {
                const userByEmail = await User.findOne({ email: session.user.email })
                    .select("-password -__v")
                    .lean();
                
                if (userByEmail) {
                    return NextResponse.json({ user: userByEmail }, { status: 200 });
                }
            }
            
            return NextResponse.json(
                { message: "User ID not found in session" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId)
            .select("-password -__v")
            .lean();

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Success response
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        // Log the actual error for server debugging
        console.error("Error in my-profile-data API:", error);

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