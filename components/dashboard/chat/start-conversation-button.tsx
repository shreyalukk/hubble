"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MessageSquare, Lock } from "lucide-react";

interface StartConversationButtonProps {
  otherUserId: string;
  currentUserId: string;
  isOnline?: boolean;
}

export function StartConversationButton({ 
  otherUserId, 
  currentUserId,
  isOnline = true
}: StartConversationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!isOnline) return;
    setIsLoading(true);
    const supabase = createClient();

    // Ensure user_a is less than user_b for uniqueness constraint
    const userA = currentUserId < otherUserId ? currentUserId : otherUserId;
    const userB = currentUserId < otherUserId ? otherUserId : currentUserId;

    // Check if conversation already exists
    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_a_id", userA)
      .eq("user_b_id", userB)
      .single();

    if (existingConvo) {
      router.push(`/messages/${existingConvo.id}`);
      return;
    }

    // Otherwise, create a new one
    const { data: newConvo, error } = await supabase
      .from("conversations")
      .insert({
        user_a_id: userA,
        user_b_id: userB,
      })
      .select()
      .single();

    if (newConvo) {
      router.push(`/messages/${newConvo.id}`);
    } else {
      console.error("Error creating conversation:", error);
      setIsLoading(false);
    }
  };

  if (!isOnline) {
    return (
      <button
        disabled
        className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-1.5 text-xs"
        title="Only logged-in users can receive messages"
      >
        <Lock className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Offline</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleStart}
      disabled={isLoading}
      className="p-2 px-3 rounded-lg bg-[#F5C542] hover:bg-[#e5b532] transition-colors text-white font-medium text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
      title="Message logged-in user"
    >
      <MessageSquare className="w-4 h-4" />
      <span>Message</span>
    </button>
  );
}
