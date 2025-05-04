import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    await dbConnect();
    try {
        const {username,email,password} = await req.json();
        const existingVerifiedUsername = await User.findOne({
            username,
            isVerified:true
        })
        if(existingVerifiedUsername){
            return NextResponse.json({
                message:"Username already taken",
                success:false
            },{status:409})
        }
        const existingUserEmail = await User.findOne({email});
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserEmail){
            if(existingUserEmail.isVerified){
                return NextResponse.json({
                    message:"Email already taken",
                    success:false
                },{status:409})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserEmail.password = hashedPassword;
                existingUserEmail.verificationCode = verificationCode;
                existingUserEmail.verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
                await existingUserEmail.save();

            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new User({
                    username,
                    email,
                    password:hashedPassword,
                    verificationCode,
                    verificationCodeExpires:expiryDate,
                    isAcceptingMessage:true,
                    isVerified:false,
                    message:[]
            })
            await newUser.save();
        }
        const sendEmail = await sendVerificationEmail(email,password,username)
        if(!sendEmail.success){
            return NextResponse.json({
                message:sendEmail.message,
                success:false
            },{status:500})
        }
        return NextResponse.json({
            message:"Verification code sent to your email",
            success:true
        },{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message:"Internal server error",
            success:false
        },{status:500})

    }
}