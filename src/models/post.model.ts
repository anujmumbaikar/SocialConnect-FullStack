import mongoose from "mongoose";
import User from "./user.model";
export const POST_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;
export interface IPost{
    postUrl:string;
    caption:string;
    userId: mongoose.Schema.Types.ObjectId
    transformation: {
        height: number;
        width: number;
        quality?: number;
    },
}
const postSchema = new mongoose.Schema<IPost>({
    postUrl:{
        type: String,
        required: true,
    },
    caption:{
        type: String,
        default: "",
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transformation:{
        height: {
            type: Number,
            default: POST_DIMENSIONS.height,
        },
        width: {
            type: Number,
            default: POST_DIMENSIONS.width,
        },
        quality:{
            type: Number,
            default: 80,
        }
    }
},{timestamps:true});
const Post = mongoose.models?.Post || mongoose.model<IPost>("Post", postSchema);
export default Post;