import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { use } from "react";
import {z} from "zod";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
    
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            return NextResponse.json({
                message: "Invalid query parameter",
                success: false,
            },{status: 400})
        }
        const {username} = result.data;
        const existingVerifiedUser = await User.findOne({username , isVerified: true})
            if(existingVerifiedUser){
                return Response.json({
                    success: false,
                    message: "Username already exists",
                },{status: 400})
            }
            return Response.json({
                success: true,
                message: "Username is available",
            },{status: 200})
    } catch (error) {
        return NextResponse.json({
            message: "Internal server error",
            success: false,
        },{status: 500})
    }

}