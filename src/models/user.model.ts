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
     required:[true,"Username is required"],
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
     required:[true,"Verification code is required"],
    },
    verificationCodeExpires:{
     type:Date,
     required:[true,"Verification code expires is required"],
    },
    isVerified:{
     type:Boolean,
     default:false
    },
    gender:{
        type:String,
    }
},{
    timestamps:true
});
userSchema.pre("save",async function(next){
    if(this.isModified("password") && this.password && this.provider === "credential"){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
const User = models?.User || model<IUser>("User",userSchema);
export default User;

