import mongoose from "mongoose";
import User,{IUser} from "./user.model";
export const POST_DIMENSIONS = {
    width: 920,
    height: 1482,
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