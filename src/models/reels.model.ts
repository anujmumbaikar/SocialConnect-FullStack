import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;
export interface IReels{
    reelUrl:string;
    caption:string;
    userId: mongoose.Types.ObjectId;
    title:string;
    transformation: {
        height: number;
        width: number;
        quality?: number;
    },
}
const reelsSchema = new mongoose.Schema<IReels>({
    reelUrl:{
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
    title:{
        type: String,
        default: "",
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
const Reels = mongoose.models?.Reels || mongoose.model<IReels>("Reel", reelsSchema);
export default Reels;