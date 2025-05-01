import mongoose from "mongoose";


export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;
export interface IPost{
    postUrl:string;
    caption:string;
    userId: mongoose.Types.ObjectId;
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
            default: VIDEO_DIMENSIONS.height,
        },
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width,
        },
        quality:{
            type: Number,
            default: 80,
        }
    }
},{timestamps:true});
const Post = mongoose.models?.Post || mongoose.model<IPost>("Post", postSchema);
export default Post;