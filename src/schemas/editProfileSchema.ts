import {z} from 'zod';
import { usernameValidation } from './signUpSchema';
export const editProfileSchema = z.object({
    avatar: z.string().optional(),
    username: usernameValidation,
    bio:z.string().optional(),
    gender:z.string().optional(),
})