import mongoose from "mongoose";
import User, { IUser } from "./user.model";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;
export interface IReel{
    _id: string;
    reelUrl:string;
    caption:string;
    userId:IUser;
    title:string;
    transformation: {
        height: number;
        width: number;
        quality?: number;
    },
}
export interface IPopulatedReel extends Omit<IReel, 'userId'> {
    userId: IUser;
}
const reelsSchema = new mongoose.Schema<IReel>({
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
const Reel = mongoose.models.Reel || mongoose.model<IReel>("Reel", reelsSchema);
export default Reel;