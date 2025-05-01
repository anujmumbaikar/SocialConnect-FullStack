import mongoose,{Schema,Document, models, model} from "mongoose";
import User from "./user.model";

export interface ISocial {
    userFollower: mongoose.Types.ObjectId ;
    userFollowing: mongoose.Types.ObjectId;
    isFollowing: boolean;
}
const socialSchema = new mongoose.Schema<ISocial>({
    userFollower:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userFollowing:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isFollowing: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});
const Social = models?.Social || model<ISocial>("Social", socialSchema);
export default Social;