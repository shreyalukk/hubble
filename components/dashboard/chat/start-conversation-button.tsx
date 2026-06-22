"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface StartConversationButtonProps {
  otherUserId: string;
  currentUserId: string;
}

export function StartConversationButton({ otherUserId, currentUserId }: StartConversationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
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

  return (
    <button
      onClick={handleStart}
      disabled={isLoading}
      className="p-2 rounded-lg bg-[#FAF6F0] hover:bg-[#E8DDD0] transition-colors text-gray-700 disabled:opacity-50"
      title="Message"
    >
      <MessageSquare className="w-4 h-4" />
    </button>
  );
}
