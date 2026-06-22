"use client";

import { useEffect, useState, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { createClient } from "@/lib/supabase/client";

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  users?: { full_name: string };
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select(`
          id,
          content,
          created_at,
          sender_id,
          users (full_name)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data as any);
      }
      setIsLoading(false);
      scrollToBottom();
    };

    fetchMessages();

    // 2. Subscribe to realtime updates
    const subscription = supabase
      .channel(`chat_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch sender info for the new message
          const { data: senderData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            users: senderData,
          } as ChatMessage;

          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, supabase]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
    const { error } = await supabase.from("direct_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
    });
    
    if (error) {
      console.error("Failed to send message:", error);
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAF6F0]">
        <div className="w-6 h-6 border-2 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF6F0]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              senderName={msg.users?.full_name || "Unknown"}
              isCurrentUser={msg.sender_id === currentUserId}
              createdAt={msg.created_at}
            />
          ))
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
    </div>
  );
}
