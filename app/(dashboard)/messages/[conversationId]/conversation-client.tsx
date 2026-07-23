"use client";

import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { ChatWindow } from "@/components/dashboard/chat/chat-window";
import { usePresenceContext } from "@/components/providers/presence-provider";

interface ConversationClientProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    id: string;
    full_name: string | null;
  };
}

export function ConversationClient({
  conversationId,
  currentUserId,
  otherUser,
}: ConversationClientProps) {
  const { isOnline } = usePresenceContext();
  const recipientIsOnline = isOnline(otherUser.id);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD0]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E8DDD0] bg-white">
        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#F5C542]">
              {otherUser.full_name?.charAt(0) || "U"}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                recipientIsOnline ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1a1a1a]">
              {otherUser.full_name || "Unknown User"}
            </h2>
            <div className="flex items-center gap-1.5 text-xs">
              {recipientIsOnline ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Logged In (Online)
                </span>
              ) : (
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gray-400" />
                  Offline (Not Logged In)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow 
          conversationId={conversationId} 
          currentUserId={currentUserId}
          isRecipientOnline={recipientIsOnline}
        />
      </div>
    </div>
  );
}
