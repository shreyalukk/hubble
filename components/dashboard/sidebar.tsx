"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Plus,
  ShieldCheck,
  FileText,
  BookOpen,
  Megaphone,
  ShoppingBag,
  Clock,
  LogOut,
} from "lucide-react";
import { usePresenceContext } from "@/components/providers/presence-provider";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Groups", href: "/groups" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Clock, label: "Timetables", href: "/timetable" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: BookOpen, label: "Resource Library", href: "/resources" },
  { icon: Megaphone, label: "Notice Board", href: "/announcements" },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
  { icon: ShieldCheck, label: "Coordinator Monitor", href: "/coordinators" },
  { icon: Plus, label: "Create Hub", href: "/hubs/new" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { onlineUsers } = usePresenceContext();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-16 md:w-[72px] flex flex-col items-center py-6 z-50 overflow-y-auto custom-scrollbar"
      style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E8DDD0" }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="mb-6 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#2D2D2D" }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </Link>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex items-center justify-center w-full py-2.5 transition-all duration-200"
              title={item.label}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ backgroundColor: "#F5C542" }}
                />
              )}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "#FFF9E6" : "transparent",
                }}
              >
                <Icon
                  className="w-[18px] h-[18px] transition-colors"
                  style={{
                    color: isActive ? "#D4A017" : "#9CA3AF",
                  }}
                />
              </div>

              {/* Tooltip */}
              <div
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                style={{ backgroundColor: "#2D2D2D" }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <div className="flex flex-col items-center gap-2 w-full mt-4 mb-4 border-t border-[#E8DDD0] pt-4 shrink-0">
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Online</div>
          {onlineUsers.filter(u => u.id !== onlineUsers[0]?.id).slice(0, 3).map((user) => (
            <div key={user.id} className="relative group cursor-pointer" title={user.name}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
              {/* Tooltip */}
              <div
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                style={{ backgroundColor: "#2D2D2D" }}
              >
                {user.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1 w-full shrink-0">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex items-center justify-center w-full py-2.5 transition-all duration-200"
              title={item.label}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#FAF6F0] transition-colors">
                <Icon className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors" />
              </div>
              <div
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                style={{ backgroundColor: "#2D2D2D" }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
        <button
          className="group flex items-center justify-center w-full py-2.5 transition-all duration-200"
          title="Log out"
        >
          <LogOut className="w-[18px] h-[18px]" style={{ color: "#9CA3AF" }} />
        </button>
      </div>
    </aside>
  );
}
