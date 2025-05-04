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
  Search, 
  Compass, 
  Film, 
  MessageSquare, 
  User,
  TrendingUp,
  Bookmark,
  Bell,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [username, setUsername] = React.useState<string | null>("anujmumbaikar12");
  const [expanded, setExpanded] = React.useState(true);
  
  const menuItems = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Explore", icon: Compass, path: "/explore" },
    { label: "Reels", icon: Film, path: "/reels" },
    { label: "Messages", icon: MessageSquare, path: "/messages" },
    { label: "Trending", icon: TrendingUp, path: "/trending" },
    { label: "Saved", icon: Bookmark, path: "/saved" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  return (
    <div>
      <Sidebar 
      className={`bg-white border-r border-slate-100 shadow-sm transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}
      {...props}
    >
      <SidebarHeader className={`font-bold py-6 px-4 flex items-center justify-${expanded ? 'start' : 'center'} gap-2`}>
        {expanded ? (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center">
              <span className="font-extrabold">S</span>
            </div>
            <span className="text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SOCIALXMEDIA
            </span>
          </>
        ) : (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center">
            <span className="font-extrabold">S</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto rounded-full h-8 w-8 p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 4L5.5 7.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 11L9.5 7.5L6.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu className="flex flex-col gap-1 w-full">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton 
                onClick={() => router.push(item.path)}
                className={`
                  flex items-center gap-3 py-3 px-4 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600
                  ${expanded ? 'justify-start' : 'justify-center'} transition-all duration-200
                `}
              >
                <item.icon className={`${expanded ? 'h-5 w-5' : 'h-6 w-6'}`} />
                {expanded && (
                  <span className={`font-medium text-base transition-opacity duration-200`}>
                    {item.label}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <div className="mt-auto mb-4 px-3">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${username}`)}
          className={`
            w-full rounded-lg p-3 flex items-center gap-3 hover:bg-slate-100
            ${expanded ? 'justify-start' : 'justify-center'}
          `}
        >
          <Avatar className="h-9 w-9 ring-2 ring-purple-100">
            <AvatarFallback className="bg-purple-100 text-purple-800 font-medium">
              {username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="text-left">
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-slate-500">View Profile</p>
            </div>
          )}
        </Button>
      </div>
      
      <div className="px-3 pb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/settings')}
          className={`
            w-full rounded-lg p-3 flex items-center gap-3 hover:bg-slate-100
            ${expanded ? 'justify-start' : 'justify-center'}
          `}
        >
          <Settings className="h-5 w-5 text-slate-600" />
          {expanded && <span className="font-medium text-sm">Settings</span>}
        </Button>
      </div>

      <SidebarRail className="bg-slate-50" />
    </Sidebar>
    </div>
  );
}