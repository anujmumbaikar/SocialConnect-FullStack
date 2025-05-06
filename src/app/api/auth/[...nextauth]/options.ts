// auth/options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please provide both identifier and password");
        }
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("Invalid credentials");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email before signing in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            fullname: user.fullname,
            bio: user.bio,
            gender: user.gender,
            avatar: user.avatar,
            provider: user.provider,
          };
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
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
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      await dbConnect();
    
      // First-time login with OAuth
      if (account && profile) {
        const provider = account.provider;
        let dbUser = await User.findOne({ email: profile.email });
    
        if (!dbUser) {
          dbUser = await User.create({
            email: profile.email,
            username: (profile.email as string).split("@")[0],
            provider,
            avatar: (profile as any).picture || (profile as any).avatar_url || "",
            isVerified: true,
            verificationCode: "",
            verificationCodeExpires: new Date(),
          });
        } else {
          dbUser.provider = provider;
          if (!dbUser.avatar && (profile as any).picture) {
            dbUser.avatar = (profile as any).picture;
          }
          dbUser.isVerified = true;
          await dbUser.save();
        }
    
        token._id = dbUser._id.toString();
        token.email = dbUser.email;
        token.username = dbUser.username;
        token.fullname = dbUser.fullname;
        token.avatar = dbUser.avatar;
        token.bio = dbUser.bio;
        token.gender = dbUser.gender;
        token.provider = dbUser.provider;
    
      } else if (user) {
        // Credentials provider
        token._id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.gender = user.gender;
        token.provider = user.provider;
      }
    
      return token;
    },    
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.fullname = token.fullname as string;
        session.user.avatar = token.avatar as string;
        session.user.bio = token.bio as string;
        session.user.gender = token.gender as string;
        session.user.provider = token.provider as string;
      }
    
      return session;
    }
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};