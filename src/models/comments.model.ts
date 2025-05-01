import mongoose from "mongoose";

export interface IComments{
    postId?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    reelId?: mongoose.Types.ObjectId;
    comment: string;
}
const commentsSchema = new mongoose.Schema<IComments>({
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
    comment:{
        type: String,
        default: "",
    },
},{timestamps:true});
const Comments = mongoose.models?.Comments || mongoose.model<IComments>("Comments", commentsSchema);
export default Comments;