"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function MessageInput({ onSendMessage, isLoading = false }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    const currentMessage = message;
    setMessage(""); // optimistic clear
    await onSendMessage(currentMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-white border-t border-[#E8DDD0]">
      <div className="flex items-center gap-2 mb-1">
        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ImageIcon className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Smile className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full max-h-32 min-h-[44px] p-3 text-sm rounded-xl resize-none outline-none focus:ring-2 focus:ring-[#F5C542]/50 bg-gray-50 border border-transparent focus:border-[#F5C542] focus:bg-white transition-all"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="p-3 mb-0.5 rounded-full bg-[#F5C542] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e5b532] transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
