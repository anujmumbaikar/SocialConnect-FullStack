import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { editProfileSchema } from "@/schemas/editProfileSchema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const validatedData = editProfileSchema.parse(body);
    if (validatedData.username) {
      const existingUserWithUsername = await User.findOne({ 
        username: validatedData.username,
        email: { $ne: session.user.email }
      });
      
      if (existingUserWithUsername) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }
    
    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
          username: validatedData.username,
          fullname: validatedData.fullname,
          avatar: validatedData.avatar,
          bio: validatedData.bio,
          gender: validatedData.gender
        }
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        gender: updatedUser.gender
      }
    });
    
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// We also support PUT method for REST convention
export { POST as PUT };