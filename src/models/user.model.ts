import mongoose,{Schema,Document} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser{
    username:string;
    email:string;
    password:string;
    address?:string;
    phone?:string;
    avatar?:string;
    verificationCode:string;
    verificationCodeExpires:Date;
    isVerified:boolean;
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
     required:[true,"Password is required"],
     minLength:6,
     maxLength:20
    },
    address:{
     type:String,
     default:""
    },
    phone:{
     type:String,
     default:""
    },
    avatar:{
     type:String,
     default:""
    },
    verificationCode:{
     type:String,
     required:[true,"Verification code is required"],
     default:""
    },
    verificationCodeExpires:{
     type:Date,
     required:[true,"Verification code expires is required"],
     default:Date.now
    },
    isVerified:{
     type:Boolean,
     default:false
    }
},{
    timestamps:true
});

