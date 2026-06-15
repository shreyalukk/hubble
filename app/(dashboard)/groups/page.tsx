"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { GroupCard } from "@/components/dashboard/group-card";
import Link from "next/link";

const mockGroups = [
  { id: 1, type: "PUBLIC GROUP" as const, title: "Graphic Design", activeText: "Active 7 days ago", membersCount: 293, illustrationId: 1 },
  { id: 2, type: "PRIVATE GROUP" as const, title: "Art Group", activeText: "Active 2 days ago", membersCount: 156, illustrationId: 2 },
  { id: 3, type: "PUBLIC GROUP" as const, title: "UX/UI Design", activeText: "Active today", membersCount: 412, illustrationId: 3 },
  { id: 4, type: "PUBLIC GROUP" as const, title: "Typography", activeText: "Active 3 days ago", membersCount: 89, illustrationId: 4 },
  { id: 5, type: "PUBLIC GROUP" as const, title: "Vector Graphic", activeText: "Active 1 day ago", membersCount: 201, illustrationId: 5 },
  { id: 6, type: "PUBLIC GROUP" as const, title: "Identity", activeText: "Active 5 days ago", membersCount: 134, illustrationId: 6 },
  { id: 7, type: "PRIVATE GROUP" as const, title: "Mobile Apps", activeText: "Active today", membersCount: 378, illustrationId: 7 },
  { id: 8, type: "PRIVATE GROUP" as const, title: "Readymig", activeText: "Active 1 day ago", membersCount: 67, illustrationId: 8 },
  { id: 9, type: "PUBLIC GROUP" as const, title: "UX Research", activeText: "Active today", membersCount: 245, illustrationId: 9 },
];

const tabs = [
  { label: "All Groups", count: 31 },
  { label: "My Groups", count: 10 },
  { label: "Public", count: 23 },
  { label: "Private", count: 8 },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredGroups = mockGroups.filter((g) => {
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 2) return g.type === "PUBLIC GROUP";
    if (activeTab === 3) return g.type === "PRIVATE GROUP";
    return true;
  });

  return (
    <div className="w-full flex flex-col min-h-full">
      
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
          Groups
        </h1>
        <Link
          href="/hubs/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#2D2D2D" }}
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Link>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: activeTab === index ? "#2D2D2D" : "transparent",
                color: activeTab === index ? "#FFFFFF" : "#6b7280",
              }}
            >
              {tab.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: activeTab === index ? "rgba(255,255,255,0.2)" : "#F3EEEA",
                  color: activeTab === index ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                className="h-10 pl-10 pr-4 rounded-xl text-sm outline-none w-56 transition-all"
                style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #E8DDD0", color: "#1a1a1a" }}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0", color: "#6b7280" }}
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} {...group} />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2" style={{ color: "#1a1a1a" }}>No groups found</p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-8">
        <p className="text-sm font-medium mb-4 sm:mb-0" style={{ color: "#9CA3AF" }}>
          Showing {filteredGroups.length} of {mockGroups.length} groups
        </p>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0", color: "#9CA3AF" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#F5C542", color: "#1a1a1a" }}
          >
            1
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0", color: "#6b7280" }}
          >
            2
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0", color: "#9CA3AF" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 text-xs text-center" style={{ color: "#9CA3AF", borderTop: "1px solid #E8DDD0" }}>
        Hubble © 2025. All rights reserved.
      </div>
    </div>
  );
}
