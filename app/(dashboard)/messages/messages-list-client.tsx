"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, UserCheck } from "lucide-react";
import { usePresenceContext } from "@/components/providers/presence-provider";

interface FormattedConversation {
  id: string;
  otherUserId: string;
  name: string;
  lastMessage: string;
  time: string;
}

interface MessagesListClientProps {
  conversations: FormattedConversation[];
}

export function MessagesListClient({ conversations }: MessagesListClientProps) {
  const { isOnline } = usePresenceContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
            Messages
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Send direct messages to users logged into the website
          </p>
        </div>
        <Link 
          href="/messages/new"
          className="px-4 py-2.5 bg-[#2D2D2D] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-[#F5C542]" />
          <span>New Message</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="w-full h-11 pl-11 pr-4 rounded-xl text-sm outline-none bg-white border border-[#E8DDD0] focus:border-[#F5C542] text-[#1a1a1a] transition-all"
        />
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {filteredConversations.map((convo) => {
          const recipientOnline = isOnline(convo.otherUserId);

          return (
            <Link href={`/messages/${convo.id}`} key={convo.id}>
              <div
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md mb-2 bg-white border border-[#E8DDD0] hover:border-[#F5C542]/50"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#F5C542]">
                    {convo.name.charAt(0)}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      recipientOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                    title={recipientOnline ? "Logged In" : "Offline"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate text-[#1a1a1a]">
                        {convo.name}
                      </span>
                      {recipientOnline ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Logged In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400">
                          Offline
                        </span>
                      )}
                    </div>
                    <span className="text-xs shrink-0 ml-2 text-gray-400">{convo.time}</span>
                  </div>
                  <p className="text-xs truncate text-gray-500">{convo.lastMessage}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state if no convos */}
      {filteredConversations.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#E8DDD0]" />
          <h2 className="text-xl font-bold mb-2 text-[#1a1a1a]">No messages found</h2>
          <p className="text-sm text-gray-400 mb-4">
            Start a new conversation with a user who is logged into the website.
          </p>
          <Link
            href="/messages/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5C542] text-white text-xs font-semibold rounded-xl hover:bg-[#e5b532] transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Message Logged-In Users</span>
          </Link>
        </div>
      )}
    </div>
  );
}
