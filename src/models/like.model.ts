import mongoose from "mongoose";

export interface ILike{
    postId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    reelId: mongoose.Types.ObjectId;
    isLike: boolean;
}
const likeSchema = new mongoose.Schema<ILike>({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
    },
    isLike:{
        type: Boolean,
        default: false,
    },
},{timestamps:true});
const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", likeSchema);
export default Like;