'use client'
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [username, setUsername] = React.useState<string | null>('anujmumbaikar12')
  return (
    <Sidebar {...props}>
      <SidebarHeader className="text-2xl font-bold w-full text-center py-4">
        SOCIALXMEDIA
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col gap-2 text-4xl font-bold w-full ml-4">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/dashboard")}>
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/search")}>
              Search
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/explore")}>
              Explore
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/reels")}>
              Reels
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/messages")}>
              Messages
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push(`/${username}`)}>
              My Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
