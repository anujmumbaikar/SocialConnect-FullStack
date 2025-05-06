"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Compass,
  Film,
  MessageSquare,
  TrendingUp,
  Bookmark,
  Bell,
  Settings,
  Plus,
  LogIn,
  Image,
  VideoIcon,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [expanded, setExpanded] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState("/dashboard");
  const [profileData, setProfileData] = React.useState({
    username: "",
    avatar: "",
    isLoggedIn: false
  });

  // Fetch user profile data when logged in
  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "authenticated") {
        try {
          const { data } = await axios.get('/api/my-profile-data');
          if (data.user) {
            setProfileData({
              username: data.user.username || session?.user?.email?.split('@')[0] || "User",
              avatar: data.user.avatar || session?.user?.image || "",
              isLoggedIn: true
            });
          }
        } catch (error) {
          if (session?.user) {
            setProfileData({
              username: session.user.username || session.user.email?.split('@')[0] || "User",
              avatar: session.user.avatar || session.user.image || "",
              isLoggedIn: true
            });
          }
        }
      } else {
        setProfileData({
          username: "",
          avatar: "",
          isLoggedIn: false
        });
      }
    };

    fetchProfileData();
  }, [session, status]);

  // Set active item based on current path
  React.useEffect(() => {
    // This is a simplified version - in a real app, you'd use the actual route
    const path = window.location.pathname;
    setActiveItem(path);
  }, []);

  const menuItems = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "Explore", icon: Compass, path: "/explore" },
    { label: "Reels", icon: Film, path: "/reels" },
    { label: "Messages", icon: MessageSquare, path: "/messages", badge: 3 },
    { label: "Trending", icon: TrendingUp, path: "/trending" },
    { label: "Saved", icon: Bookmark, path: "/saved" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: 5 },
    {
      label: "Create",
      icon: Plus,
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={`
                flex items-center gap-3 py-3 px-4 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600
                group relative ${expanded ? "justify-start" : "justify-center"} transition-all duration-200
              `}
            >
              <div className="relative flex items-center justify-center">
                <div className={`
                  absolute inset-0 rounded-full bg-purple-100 scale-0 transition-transform duration-200
                  group-hover:scale-100
                `}></div>
                <Plus className={`${expanded ? "h-5 w-5" : "h-6 w-6"} relative z-10`} />
              </div>
              {expanded && (
                <span className="font-medium text-base transition-opacity duration-200">
                  Create
                </span>
              )}
              {expanded && (
                <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="right" 
            align="start" 
            className="w-56 p-2 rounded-xl border border-slate-200 shadow-lg animate-in fade-in-80"
            sideOffset={10}
          >
            <DropdownMenuItem 
              onClick={() => router.push("/create-story")}
              className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700"
            >
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Add Story</span>
                <span className="text-xs text-slate-500">Share a moment</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1.5 bg-slate-100" />
            
            <DropdownMenuItem 
              onClick={() => router.push("/create-post")}
              className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Image className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Add Post</span>
                <span className="text-xs text-slate-500">Share photos with followers</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1.5 bg-slate-100" />
            
            <DropdownMenuItem 
              onClick={() => router.push("/create-reel")}
              className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700"
            >
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <VideoIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Add Reel</span>
                <span className="text-xs text-slate-500">Create short videos</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleNavigate = (path: string) => {
    setActiveItem(path);
    router.push(path);
  };

  return (
    <div>
      <Sidebar
        className={`bg-white border-r border-slate-100 shadow-lg rounded-r-xl transition-all duration-300 ${expanded ? "w-64" : "w-20"}`}
        {...props}
      >
        <SidebarHeader
          className={`font-bold py-6 px-5 flex items-center justify-${expanded ? "between" : "center"} gap-2`}
        >
          {expanded ? (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-md">
                  <span className="font-extrabold">S</span>
                </div>
                <span className="text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                  SOCIALX
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-8 w-8 hover:bg-slate-100"
                onClick={() => setExpanded(false)}
              >
                <ChevronLeft className="h-4 w-4 text-slate-400" />
              </Button>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-md">
                <span className="font-extrabold">S</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-8 w-8 hover:bg-slate-100 absolute right-2 top-6"
                onClick={() => setExpanded(true)}
              >
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Button>
            </>
          )}
        </SidebarHeader>

        <div className="px-3 pb-2">
          <div className={`h-1 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full ${expanded ? "" : "mx-auto w-8"}`}></div>
        </div>

        <SidebarContent className="px-3 py-3">
          <SidebarMenu className="flex flex-col gap-1.5 w-full">
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                {item.component ? (
                  item.component
                ) : (
                  <SidebarMenuButton
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 relative
                      ${activeItem === item.path 
                        ? 'bg-purple-100 text-purple-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-purple-600'}
                      ${expanded ? "justify-start" : "justify-center"}
                    `}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className={`
                        ${activeItem === item.path ? "" : "absolute inset-0 rounded-full bg-purple-100 scale-0 transition-transform duration-200 group-hover:scale-100"}
                      `}></div>
                      <item.icon
                        className={`${expanded ? "h-5 w-5" : "h-6 w-6"} ${
                          activeItem === item.path ? "text-purple-600" : ""
                        } relative z-10`}
                      />
                      {item.badge && (
                        <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {expanded && (
                      <span className="font-medium text-base transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>


        <div className="mt-auto mb-3 px-3">
          {profileData.isLoggedIn ? (
            <div className="space-y-2">
              {/* Profile button */}
              <Button
                variant={expanded ? "outline" : "ghost"}
                onClick={() => router.push(`/${profileData.username}`)}
                className={`
                  w-full rounded-xl p-2.5 flex items-center gap-3 
                  ${expanded 
                    ? "border-slate-200 shadow-sm justify-start hover:border-purple-200 hover:bg-purple-50" 
                    : "justify-center hover:bg-slate-100"}
                `}
              >
                <Avatar className="h-9 w-9 ring-2 ring-purple-100">
                  {profileData.avatar ? (
                    <AvatarImage src={profileData.avatar} alt={profileData.username} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white font-medium">
                      {profileData.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
    
                {expanded && (
                  <div className="text-left">
                    <p className="text-sm font-medium">{profileData.username}</p>
                    <p className="text-xs text-slate-500">View Profile</p>
                  </div>
                )}
              </Button>

              {/* Settings button when expanded */}
              {expanded && (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/settings")}
                  className="w-full rounded-lg py-2.5 flex items-center justify-start gap-2 hover:bg-slate-100"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium">Settings</span>
                </Button>
              )}
            </div>
          ) : (
            // Show sign-in button when logged out
            <div className="mb-10">
              <Button
              variant="outline"
              onClick={() => signIn()}
              className={`
                w-full rounded-lg p-3 flex items-center gap-3 py-4
                border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 shadow-md
                ${expanded ? "justify-start" : "justify-center"}
              `}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-200 scale-0 transition-transform duration-200 group-hover:scale-100"></div>
                <LogIn className="h-5 w-5 text-purple-600 relative z-10" />
              </div>
              {expanded && <span className="font-bold text-md">Sign In</span>}
            </Button>
            </div>
          )}
        </div>

        {/* Settings button when collapsed and logged in */}
        {!expanded && profileData.isLoggedIn && (
          <div className="mb-4 px-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/settings")}
              className="w-full rounded-lg p-2 flex items-center justify-center hover:bg-slate-100"
            >
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Settings className="h-4 w-4 text-slate-600" />
              </div>
            </Button>
          </div>
        )}

        <SidebarRail className="bg-slate-50 rounded-r-xl" />
      </Sidebar>
    </div>
  );
}