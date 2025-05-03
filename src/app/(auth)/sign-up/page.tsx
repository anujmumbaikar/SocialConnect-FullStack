'use client'
import React,{useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import {useDebounceCallback} from 'usehooks-ts'
import Link from 'next/link'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios from 'axios'
import {Loader2} from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function page() {
  const [username,setUsername] = React.useState<string>("")
  const [usernameMessage,setUsernameMessage] = React.useState<string>("")
  const [isCheckingUsername,setIsCheckingUsername] = React.useState<boolean>(false)
  const [isSubmitting,setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const debouncedUsername = useDebounceCallback((value: string) => setUsername(value), 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(()=>{
    const checkUsernameUniqueness = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage("Checking username...")
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          toast.error("Error checking username uniqueness");
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUniqueness()
  },[username])
  const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up',data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      toast.error("Error signing up")
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Create an Account
          </h1>
          <p className="mb-4">Join us and start your journey!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <p
                    className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                    {/* here we have not used onChange because it handle on its own
                previous we used onChange to set username state because we are handling the case of debouncing
                 */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page