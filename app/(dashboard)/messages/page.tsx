import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    // Identify the *other* user in the conversation
    const otherUser = c.user_a.id === user.id ? c.user_b : c.user_a;
    // Get the latest message (assuming they are returned in some order or just taking the last one)
    const latestMessage = c.direct_messages && c.direct_messages.length > 0 
      ? c.direct_messages[c.direct_messages.length - 1] 
      : null;

    return {
      id: c.id,
      name: otherUser.full_name || "Unknown User",
      lastMessage: latestMessage ? latestMessage.content : "Started a conversation",
      time: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : "",
      unread: 0,
    };
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
          Messages
        </h1>
        <Link 
          href="/messages/new"
          className="px-4 py-2 bg-[#2D2D2D] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          New Message
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full h-11 pl-11 pr-4 rounded-xl text-sm outline-none transition-all"
          style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #E8DDD0", color: "#1a1a1a" }}
        />
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {conversations.map((convo) => (
          <Link href={`/messages/${convo.id}`} key={convo.id}>
            <div
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md mb-2"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: "#F5C542" }}
              >
                {convo.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold truncate" style={{ color: "#1a1a1a" }}>{convo.name}</span>
                  <span className="text-xs shrink-0 ml-2" style={{ color: "#9CA3AF" }}>{convo.time}</span>
                </div>
                <p className="text-xs truncate" style={{ color: "#6b7280" }}>{convo.lastMessage}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state if no convos */}
      {conversations.length === 0 && (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: "#E8DDD0" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>No messages yet</h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Start a conversation to see it here.</p>
        </div>
      )}
    </div>
  );
}
