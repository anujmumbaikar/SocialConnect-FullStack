'use client'
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import axios, { AxiosError } from 'axios';
import { useSession } from "next-auth/react";
import ApiResponse from "@/types/ApiResponse";

export default function EditProfile() {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isUsernameChecking, setIsUsernameChecking] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const debouncedUsername = useDebounceCallback((value: string) => setUsername(value), 500);


  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      fullname: user?.fullname ||"",
      avatar: user?.avatar || "https://www.svgrepo.com/show/452030/avatar-default.svg",
      bio: user?.bio || "" ,
      gender: user?.gender || "",
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || user.email?.split('@')[0] || "",
        fullname: user.fullname || "",
        avatar: user.avatar || user.image || "https://www.svgrepo.com/show/452030/avatar-default.svg",
        bio: user.bio || "",
        gender: user.gender || "",
      });
      setUsername(user.username || user.email?.split('@')[0] || "");
    }
  }, [user, form]);
  
  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsUsernameChecking(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(AxiosError.response?.data.message ?? "error in checking username")
        } finally {
          setIsUsernameChecking(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const handleAvatarChange = () => {
    // Implement avatar change functionality
    toast.info("Avatar change functionality to be implemented");
  };
  // const authenticator = async () => {
  //   const res = await fetch("/api/imagekit-auth");
  //   if (!res.ok) throw new Error(await res.text());
  //   return await res.json();
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && file.type.startsWith("video/")) {
  //     const reader = new FileReader();
  //     reader.onload = () => setPreviewUrl(reader.result as string);
  //     reader.readAsDataURL(file);
  //   } else {
  //     toast.error("Only video files are allowed");
  //     fileInputRef.current && (fileInputRef.current.value = "");
  //     setPreviewUrl(null);
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    setIsSubmitting(true);
    try {    
      const response = await axios.put('/api/edit-profile', data);
      toast.success(response.data.message);
      router.push(`/${data.username}`);
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={form.getValues().avatar} alt="Profile picture" />
              </Avatar>
              <div>
                <p className="text-lg font-medium">{form.watch("fullname")}</p>
                <button 
                  type="button"
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  onClick={handleAvatarChange}
                >
                  Change profile photo
                </button>
              </div>
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
                      {isUsernameChecking && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <p
                        className={`text-sm ${usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bio" 
                          className="resize-none" 
                          maxLength={150} 
                          {...field} 
                        />
                      </FormControl>
                      <div className="text-right text-sm text-gray-500">
                        {(field.value || "").length}/150
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        This won't be part of your public profile.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show Threads badge toggle */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Show Threads badge</label>
                  </div>
                  <Switch/>
                </div>

                {/* Show account suggestions toggle */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Show account suggestions on profiles</label>
                    <p className="text-sm text-gray-500">
                      Choose whether people can see similar account suggestions on your profile, 
                      and whether your account can be suggested on other profiles.
                    </p>
                  </div>
                  <Switch/>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-sm text-gray-500">
              <p>Certain profile info, such as your name, bio and links, is visible to everyone.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}