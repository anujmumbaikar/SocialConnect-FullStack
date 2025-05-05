import mongoose,{Schema,Document, models, model} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser{
    username:string;
    fullname?:string;
    email:string;
    password?:string;  //if google login, password is not required
    avatar?:string;
    provider:"credential" | "google" | "facebook" | "github";
    verificationCode:string;
    verificationCodeExpires:Date;
    isVerified:boolean;
    createdAt?:Date;
    updatedAt?:Date;
    gender?:string;
    bio?:string;
}
const userSchema = new Schema<IUser>({
   email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    trim:true,
    match: [/^(?=.{1,254}$)(?!.*\.\.)([a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/, "Please enter a valid email"],
   },
    username:{
     type:String,
     required:[function(){
        return this.provider === "credential";
     },"Username is required"],
     unique:true,
     trim:true,
     minLength:3,
     maxLength:20
    }, 
    password:{
     type:String,
     required:function(){
        return this.provider === "credential";
     },
    },
    fullname:{
     type:String,
     minLength:3,
     maxLength:50
    },
    provider:{
        type:String,
        enum:["credential","google","facebook","github"],
        default:"credential"
    },
    avatar:{
     type:String,
     default:""
    },
    verificationCode:{
     type:String,
     required:[function(){
        return this.provider === "credential";
     },"Verification code is required"],
    },
    verificationCodeExpires:{
     type:Date,
     required:[function(){
        return this.provider === "credential";
     },"Verification code expires is required"],
    },
    isVerified:{
     type:Boolean,
     default:false
    },
    gender:{
        type:String,
    },
    bio:{
        type:String,
        default:"",
    }
},{
    timestamps:true
});

const User = models?.User || model<IUser>("User",userSchema);
export default User;

