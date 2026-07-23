import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessagesListClient } from "./messages-list-client";

export default async function DirectMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch conversations for the current user
  const { data: conversationsData } = await supabase
    .from("conversations")
    .select(`
      id,
      updated_at,
      user_a:users!conversations_user_a_id_fkey(id, full_name, avatar_url),
      user_b:users!conversations_user_b_id_fkey(id, full_name, avatar_url),
      direct_messages(content, created_at)
    `)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  // Format the conversations
  const conversations = (conversationsData || []).map((c: any) => {
    const otherUser = c.user_a.id === user.id ? c.user_b : c.user_a;
    const latestMessage = c.direct_messages && c.direct_messages.length > 0 
      ? c.direct_messages[c.direct_messages.length - 1] 
      : null;

    return {
      id: c.id,
      otherUserId: otherUser.id,
      name: otherUser.full_name || "Unknown User",
      lastMessage: latestMessage ? latestMessage.content : "Started a conversation",
      time: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : "",
    };
  });

  return <MessagesListClient conversations={conversations} />;
}
