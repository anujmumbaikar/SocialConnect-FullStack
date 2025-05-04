import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          } else {
            return user;
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user,account }) {
      await dbConnect();
      // Handle Google Sign In
      if (account?.provider === "google" && token?.email) {
        let existingUser = await User.findOne({ email: token.email });

        if (!existingUser) {
          const newUser = await User.create({
            email: token.email,
            provider: "google", // no password needed
          });
          token.id = newUser._id.toString();
        } else {
          token.id = existingUser._id.toString();
        }
      }
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.email = user.email;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.gender = user.gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.fullname = token.fullname;
        session.user.avatar = token.avatar;
        session.user.bio = token.bio;
        session.user.gender = token.gender;
      }
      return session;
    },
  },
};
