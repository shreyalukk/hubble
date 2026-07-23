import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConversationClient } from "./conversation-client";

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

  // Fetch the conversation to get the other user's info
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
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-sm">Conversation not found.</p>
      </div>
    );
  }

  const userA: any = conversation.user_a;
  const userB: any = conversation.user_b;
  const otherUser = userA.id === user.id ? userB : userA;

  return (
    <ConversationClient
      conversationId={conversationId}
      currentUserId={user.id}
      otherUser={otherUser}
    />
  );
}
