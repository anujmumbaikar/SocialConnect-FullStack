import mongoose from "mongoose";

export interface ILike{
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    ReelId: mongoose.Types.ObjectId;
    isLike: boolean;
}
const likeSchema = new mongoose.Schema<ILike>({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ReelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        required: true,
    },
    isLike:{
        type: Boolean,
        default: false,
    },
},{timestamps:true});
const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", likeSchema);
export default Like;