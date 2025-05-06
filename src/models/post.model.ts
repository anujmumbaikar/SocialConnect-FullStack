import mongoose from "mongoose";
import User from "./user.model";

export const POST_DIMENSIONS = {
    width: 1024,
    height: 1536,
}

// Base Post interface
export interface IPost {
    _id: string;
    postUrl: string;
    caption: string;
    userId: mongoose.Schema.Types.ObjectId | IUser;
    transformation: {
        height: number;
        width: number;
        quality?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

// For populated user data
export interface IUser {
    _id: string;
    username: string;
    avatar: string;
    // Add other user fields as needed
}

// Interface for populated posts
export interface IPopulatedPost extends Omit<IPost, 'userId'> {
    userId: IUser;
}

const postSchema = new mongoose.Schema<IPost>({
    postUrl: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: "",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transformation: {
        height: {
            type: Number,
            default: POST_DIMENSIONS.height,
        },
        width: {
            type: Number,
            default: POST_DIMENSIONS.width,
        },
        quality: {
            type: Number,
            default: 80,
        }
    }
}, { timestamps: true });

const Post = mongoose.models?.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;