import mongoose from "mongoose";

export interface IMessage{
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    mediaUrl?: string;
}
const messageSchema = new mongoose.Schema<IMessage>({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    mediaUrl:{
        type: String,
    }
},{timestamps:true});
const Message = mongoose.models?.Message || mongoose.model<IMessage>("Message", messageSchema);
export default Message;