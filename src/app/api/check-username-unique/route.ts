import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      if (existingVerifiedUser.username === session.user.username) {
        return NextResponse.json(
          {
            success: true,
            message: "This is your current username",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in checking username unique:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in checking username uniqueness",
      },
      { status: 500 }
    );
  }
}
