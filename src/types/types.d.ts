import { Connection } from "mongoose";

declare global{
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
    
}
export interface User {
  _id: string;
  username: string;
  fullname?: string;
  email: string;
  avatar?: string;
  provider: "credential" | "google" | "facebook" | "github";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  gender?: string;
  bio?: string;
}

export interface Post {
  _id: string;
  postUrl: string;
  caption: string;
  userId: User;
  transformation: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}