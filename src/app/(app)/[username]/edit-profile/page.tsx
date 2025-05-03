'use client'
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Note: In your actual implementation, you'll import and use react-hook-form and zod validation

export default function EditProfile() {
  const [avatarSrc, setAvatarSrc] = useState("/api/placeholder/100/100");
  const [charCount, setCharCount] = useState(0);
  const [formData, setFormData] = useState({
    username: "anujmumbaikar12",
    fullName: "Anuj Mumbaikar",
    bio: "",
    website: "",
    gender: "male",
    showThreadsBadge: false,
    showAccountSuggestions: true,
  });

  const handleAvatarChange = () => {
    // In real implementation, this would handle file selection
    // For demo purposes, we'll just change to a different placeholder
    setAvatarSrc("/api/placeholder/100/100");
  };

interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    
    if (name === "bio") {
        setCharCount(value.length);
    }
};

const handleSwitchChange = (name: keyof typeof formData, value: boolean) => {
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

interface FormData {
    username: string;
    fullName: string;
    bio: string;
    website: string;
    gender: string;
    showThreadsBadge: boolean;
    showAccountSuggestions: boolean;
}

const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

  const handleSubmit = () => {
    console.log(formData);
    // Here you would handle the form submission
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Main content area */}
      <div className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>

            <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={avatarSrc} alt="Profile picture" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">{formData.username}</p>
                    <button 
                      className="text-blue-500 cursor-pointer hover:text-blue-600"
                      onClick={handleAvatarChange}
                    >
                      Change profile photo
                    </button>
                  </div>
                </div>

                {/* Username field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="username" 
                  />
                </div>

                {/* Full Name field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full name" 
                  />
                </div>

                {/* Website field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Website" 
                  />
                  <p className="text-sm text-gray-500">
                    Editing your links is only available on mobile. Visit the app to change websites in your bio.
                  </p>
                </div>

                {/* Bio field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Bio" 
                    className="resize-none" 
                    maxLength={150}
                  />
                  <div className="text-right text-sm text-gray-500">
                    {charCount}/150
                  </div>
                </div>

                {/* Gender field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select 
                    defaultValue={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
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
                </div>

                {/* Show Threads badge toggle */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Show Threads badge</label>
                  </div>
                  <Switch
                    checked={formData.showThreadsBadge}
                    onCheckedChange={(checked) => handleSwitchChange("showThreadsBadge", checked)}
                  />
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
                  <Switch
                    checked={formData.showAccountSuggestions}
                    onCheckedChange={(checked) => handleSwitchChange("showAccountSuggestions", checked)}
                  />
                </div>

                <div className="pt-2">
                  <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
                    Submit
                  </Button>
                </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Certain profile info, such as your name, bio and links, is visible to everyone.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}