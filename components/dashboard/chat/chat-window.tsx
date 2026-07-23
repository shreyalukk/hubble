"use client";

import { useEffect, useState, useRef, useOptimistic, useTransition } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  attachments?: string[];
  users?: { full_name: string };
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  isRecipientOnline?: boolean;
}

export function ChatWindow({ 
  conversationId, 
  currentUserId,
  isRecipientOnline = true 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const PAGE_SIZE = 50;

  const [, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: ChatMessage) => [...state, newMessage]
  );
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<any>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const fetchMessages = async (page = 0, isInitial = false) => {
    if (!hasMore && !isInitial) return;
    if (page > 0) setIsLoadingMore(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("direct_messages")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        attachments,
        users (full_name)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false }) // Fetch latest first for pagination
      .range(from, to);

    if (error) {
      console.error("Failed to fetch messages:", error);
    } else if (data) {
      const formattedData = data.reverse() as unknown as ChatMessage[];
      if (isInitial) {
        setMessages(formattedData);
        scrollToBottom();
      } else {
        setMessages((prev) => [...formattedData, ...prev]);
      }
      
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
    
    if (isInitial) setIsLoading(false);
    if (page > 0) setIsLoadingMore(false);
  };

  useEffect(() => {
    fetchMessages(0, true);

    const chatChannel = supabase.channel(`chat_${conversationId}`);
    setChannel(chatChannel);

    // Subscribe to realtime updates, deletions and typing indicators
    chatChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
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
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.old?.id) {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .on(
        "broadcast",
        { event: "typing" },
        ({ payload }) => {
          if (payload.userId !== currentUserId) {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.add(payload.userId);
              return newSet;
            });

            // Clear typing status after 3 seconds
            setTimeout(() => {
              setTypingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(payload.userId);
                return newSet;
              });
            }, 3000);
          }
        }
      )
      .subscribe();

    return () => {
      chatChannel.unsubscribe();
    };
  }, [conversationId, supabase]);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchMessages(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page]);

  const handleSendMessage = async (content: string, attachments: string[] = []) => {
    if (!isRecipientOnline) {
      console.warn("Recipient is offline. Messages can only be sent to logged-in users.");
      return;
    }

    // 1. Optimistic Update (wrapped in startTransition for React 19)
    startTransition(() => {
      const tempId = crypto.randomUUID();
      addOptimisticMessage({
        id: tempId,
        content,
        created_at: new Date().toISOString(),
        sender_id: currentUserId,
        attachments,
        users: { full_name: "You" }
      });
    });
    scrollToBottom();

    // 2. Background DB Insert
    const { error } = await supabase.from("direct_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      attachments,
    });
    
    if (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistically remove from state
    setMessages((prev) => prev.filter((m) => m.id !== messageId));

    // Execute DB deletion
    const { error } = await supabase
      .from("direct_messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      console.error("Failed to delete message:", error);
      // Re-fetch to restore if failed
      fetchMessages(0, true);
    }
  };

  const handleTyping = () => {
    if (channel && isRecipientOnline) {
      channel.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId },
      });
    }
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
      {!isRecipientOnline && (
        <div className="bg-amber-100 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>This user is offline. You can only send messages to users who are currently logged into the website.</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div ref={observerTarget} className="h-4 w-full flex items-center justify-center shrink-0 mb-4">
          {isLoadingMore && <div className="w-4 h-4 border-2 border-[#F5C542] border-t-transparent rounded-full animate-spin" />}
        </div>
        {optimisticMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>No messages yet. Say hi!</p>
          </div>
        ) : (
          optimisticMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              id={msg.id}
              content={msg.content}
              senderName={msg.users?.full_name || "Unknown"}
              isCurrentUser={msg.sender_id === currentUserId}
              createdAt={msg.created_at}
              attachments={msg.attachments}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
        
        {typingUsers.size > 0 && isRecipientOnline && (
          <div className="flex w-full mb-4 justify-start">
            <div className="bg-white border border-[#E8DDD0] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={false} 
        onTyping={handleTyping}
        disabled={!isRecipientOnline}
        disabledPlaceholder="Recipient is offline. Messages can only be sent to logged-in users."
      />
    </div>
  );
}
