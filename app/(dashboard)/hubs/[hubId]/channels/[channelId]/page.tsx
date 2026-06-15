"use client";

import { useState, useEffect } from "react";
import { Hash, Send, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const dummyMessages: Message[] = [
  { id: 1, user: "Alice Johnson", avatar: "bg-primary/20", content: "Hey everyone! Welcome to the CS 101 Study Group.", timestamp: "10:00 AM" },
  { id: 2, user: "Charlie Davis", avatar: "bg-blue-500/20", content: "Thanks Alice. Has anyone started on the first assignment?", timestamp: "10:05 AM" },
  { id: 3, user: "Bob Smith", avatar: "bg-green-500/20", content: "Not yet, I plan to start tonight. We should do a voice call later.", timestamp: "10:12 AM" },
];

export default function ChannelPage({ params }: { params: { hubId: string, channelId: string } }) {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // Setup Supabase Realtime Subscription for Live Messaging
    const channel = supabase.channel(`public:messages:channel_id=${params.channelId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          // This will be properly mapped when using actual DB IDs
          const newMsg: Message = {
            id: payload.new.id as unknown as number,
            user: "Anonymous", // Will join with users table in production
            avatar: "bg-secondary/20",
            content: payload.new.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.channelId, supabase]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now(),
      user: "You",
      avatar: "bg-purple-500/20",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Channel Header */}
      <div className="h-14 flex items-center px-4 border-b border-white/10 shrink-0 bg-zinc-950/80 backdrop-blur-md z-10">
        <Hash className="size-5 text-muted-foreground mr-2" />
        <h3 className="font-bold">{params.channelId}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Welcome message for channel */}
        <div className="mt-auto pt-10 pb-4 border-b border-white/5 mb-6">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Hash className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to #{params.channelId}!</h1>
          <p className="text-muted-foreground">This is the start of the #{params.channelId} channel.</p>
        </div>

        {/* Chat Bubbles */}
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4 group">
            <div className={`size-10 rounded-full shrink-0 ${msg.avatar}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium">{msg.user}</span>
                <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Button type="button" variant="ghost" size="icon" className="absolute left-1 text-muted-foreground hover:text-foreground">
            <PlusCircle className="size-5" />
          </Button>
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${params.channelId}`}
            className="pl-12 pr-12 py-6 bg-white/5 border-white/10 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 text-base"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className="absolute right-2 size-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
