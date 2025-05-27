import mongoose,{Document,Schema} from "mongoose";
import { IUser } from "./user.model";
import { IPost } from "./post.model";
import { IReel } from "./reels.model";
export interface ISaved extends Document {
  userId: IUser;
  postId: IPost;
  reelId: IReel;
  createdAt: Date;
}
const savedSchema = new Schema<ISaved>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: false,
  },
  reelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reel",
    required: false,
  },
}, { timestamps: true });
const Saved = mongoose.models.Saved || mongoose.model<ISaved>("Saved", savedSchema);
export default Saved;