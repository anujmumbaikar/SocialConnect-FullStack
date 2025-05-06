import 'next-auth'
import { DefaultSession } from 'next-auth';
declare module 'next-auth'{
    interface User{
        _id?: string;
        username?: string;
        email?: string;
        fullname?: string;
        provider?: string;
        avatar?: string;
        bio?: string;
        gender?: string;
    }
    interface Session{
        user:{
            _id?: string;
            username?: string | null;
            provider?: string;
            email?: string | null;
            fullname?: string;
            avatar?: string | null;
            bio?: string;
            gender?: string;
        } & DefaultSession["user"] 
    }
}
declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        username?: string;
        email?: string;
        fullname?: string;
        avatar?: string;
        bio?: string;
        gender?: string;
    }
}