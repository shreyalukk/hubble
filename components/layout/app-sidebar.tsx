import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Compass, Home, MessageSquare, BookOpen, Settings } from "lucide-react"
import Link from "next/link"

const mainNavItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Discover", url: "/discover", icon: Compass },
  { title: "Direct Messages", url: "/messages", icon: MessageSquare },
  { title: "My Courses", url: "/courses", icon: BookOpen },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold text-lg text-primary font-heading tracking-tight">
          <div className="size-6 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
          Hubble
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Hubs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dummy Hubs for now */}
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/hubs/cs101" />}>
                  <span className="text-muted-foreground">#</span>
                  <span>CS 101 Study Group</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/hubs/hackers" />}>
                  <span className="text-muted-foreground">#</span>
                  <span>Hackers Club</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />}>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
