"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/groups": "Groups",
  "/messages": "Messages",
  "/events": "Events",
  "/hubs/new": "Create Hub",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const pageTitle = breadcrumbMap[pathname] || "Hubble";

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-40 pl-16 md:pl-[72px]"
      style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8DDD0" }}
    >
      <div className="h-full w-full flex items-center justify-between px-6 md:px-8">

        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
            {pageTitle}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Search */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#FAF6F0]"
            style={{ color: "#6b7280" }}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#FAF6F0]"
            style={{ color: "#6b7280" }}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#F5C542", border: "2px solid #FFFFFF" }}
            />
          </button>

          {/* Divider */}
          <div className="h-6 w-px hidden md:block" style={{ backgroundColor: "#E8DDD0" }} />

          {/* Profile */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#F5C542" }}
            >
              U
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-sm font-medium" style={{ color: "#374151" }}>User</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
