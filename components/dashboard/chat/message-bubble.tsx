"use client";

import { format } from "date-fns";

interface MessageBubbleProps {
  content: string;
  senderName: string;
  isCurrentUser: boolean;
  createdAt: string;
}

export function MessageBubble({ content, senderName, isCurrentUser, createdAt }: MessageBubbleProps) {
  const time = format(new Date(createdAt), "h:mm a");

  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
        <span className="text-xs text-gray-500 mb-1 mx-1">
          {isCurrentUser ? "You" : senderName} • {time}
        </span>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isCurrentUser
              ? "bg-[#2D2D2D] text-white rounded-tr-sm"
              : "bg-white border border-[#E8DDD0] text-[#1a1a1a] rounded-tl-sm shadow-sm"
          }`}
        >
          <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
