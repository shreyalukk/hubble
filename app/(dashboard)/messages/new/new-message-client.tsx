"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, UserCheck, Users, Signal } from "lucide-react";
import { StartConversationButton } from "@/components/dashboard/chat/start-conversation-button";
import { usePresenceContext } from "@/components/providers/presence-provider";

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url?: string | null;
}

interface NewMessageClientProps {
  users: UserProfile[];
  currentUserId: string;
}

export function NewMessageClient({ users, currentUserId }: NewMessageClientProps) {
  const { isOnline, onlineUsers } = usePresenceContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyLoggedIn, setOnlyLoggedIn] = useState(true);

  // Filter users based on online presence and search term
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(searchTerm.toLowerCase());

    const userIsOnline = isOnline(u.id);

    if (onlyLoggedIn) {
      return matchesSearch && userIsOnline;
    }
    return matchesSearch;
  });

  const onlineCount = users.filter((u) => isOnline(u.id)).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/messages"
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              New Message
            </h1>
            <p className="text-xs text-gray-500">
              Only users currently logged into the website can receive messages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{onlineCount} Logged In Now</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-[#E8DDD0] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or role..."
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm outline-none bg-gray-50 border border-transparent focus:border-[#F5C542] transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyLoggedIn(true)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  onlyLoggedIn
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Logged-In Users ({onlineCount})
              </button>
              <button
                type="button"
                onClick={() => setOnlyLoggedIn(false)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  !onlyLoggedIn
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                All Users ({users.length})
              </button>
            </div>

            <span className="text-gray-400 hidden sm:inline">
              {onlyLoggedIn ? "Showing online users only" : "Showing all accounts"}
            </span>
          </div>
        </div>

        {/* User List */}
        <div className="divide-y divide-[#E8DDD0]">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm space-y-2">
              <Signal className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">
                {onlyLoggedIn
                  ? "No users are currently logged in."
                  : "No users match your search."}
              </p>
              {onlyLoggedIn && (
                <p className="text-xs text-gray-400">
                  When other people log into the website, they will appear here automatically.
                </p>
              )}
            </div>
          ) : (
            filteredUsers.map((u) => {
              const userOnline = isOnline(u.id);

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#F5C542]">
                        {u.full_name?.charAt(0) || "U"}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          userOnline ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1a1a1a]">
                          {u.full_name || "Unknown User"}
                        </p>
                        {userOnline ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Logged In
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                            Offline
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 capitalize">
                        {u.role || "Member"}
                      </p>
                    </div>
                  </div>

                  <StartConversationButton
                    otherUserId={u.id}
                    currentUserId={currentUserId}
                    isOnline={userOnline}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
