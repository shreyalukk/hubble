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
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Groups", href: "/groups" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Plus, label: "Create Hub", href: "/hubs/new" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-16 md:w-[72px] flex flex-col items-center py-6 z-50"
      style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E8DDD0" }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="mb-8">
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
              className="relative group flex items-center justify-center w-full py-3 transition-all duration-200"
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
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap"
                style={{ backgroundColor: "#2D2D2D" }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1 w-full">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-center w-full py-3 transition-all duration-200"
              title={item.label}
            >
              <Icon className="w-[18px] h-[18px]" style={{ color: "#9CA3AF" }} />
              <div
                className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap"
                style={{ backgroundColor: "#2D2D2D" }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
        <button
          className="group flex items-center justify-center w-full py-3 transition-all duration-200"
          title="Log out"
        >
          <LogOut className="w-[18px] h-[18px]" style={{ color: "#9CA3AF" }} />
        </button>
      </div>
    </aside>
  );
}
