import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await User.findOne({ username: decodedUsername });
        if(!user) {
            return NextResponse.json({ message: "User not found",success:false }, { status: 404 });
        }
        const isCodeValid = user.verificationCode === code;
        const isCodeNotExpired = new Date(user.verificationCodeExpires) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successfully",
            },{status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code expired",
            },{status: 400})
        }
        else{
            return NextResponse.json({
                success: false,
                message: "Invalid verification code",
            },{status: 400})
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in verifying user",
        },{status: 500})
    }
}