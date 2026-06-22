import { createClient } from "@/lib/supabase/server";
import { ChatWindow } from "@/components/dashboard/chat/chat-window";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the conversation to get the other user's name
  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id,
      user_a:users!conversations_user_a_id_fkey(id, full_name),
      user_b:users!conversations_user_b_id_fkey(id, full_name)
    `)
    .eq("id", conversationId)
    .single();

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Conversation not found.</p>
      </div>
    );
  }

  const otherUser = conversation.user_a.id === user.id ? conversation.user_b : conversation.user_a;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD0]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#E8DDD0] bg-white">
        <Link href="/messages" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#F5C542]">
          {otherUser.full_name?.charAt(0) || "U"}
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#1a1a1a]">{otherUser.full_name || "Unknown User"}</h2>
          <p className="text-xs text-gray-500">Active</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow conversationId={conversationId} currentUserId={user.id} />
      </div>
    </div>
  );
}
