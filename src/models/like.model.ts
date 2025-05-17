import mongoose from "mongoose";

export interface ILike {
    userId: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    targetType: "Post" | "Reel";
    isLike: boolean;
}
const likeSchema = new mongoose.Schema<ILike>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "targetType",
    },
    targetType: {
        type: String,
        required: true,
        enum: ["Post", "Reel"],
    },
    isLike: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", likeSchema);
export default Like;