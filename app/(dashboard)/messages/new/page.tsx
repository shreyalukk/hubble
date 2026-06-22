import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { StartConversationButton } from "@/components/dashboard/chat/start-conversation-button";

export default async function NewMessagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all other users (ideally this should be paginated or strictly searched)
  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, role")
    .neq("id", user.id)
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/messages" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
          New Message
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-[#E8DDD0]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm outline-none bg-gray-50 border border-transparent focus:border-[#F5C542] transition-all"
            />
          </div>
        </div>

        {/* User List */}
        <div className="divide-y divide-[#E8DDD0]">
          {users?.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No users found.
            </div>
          ) : (
            users?.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#F5C542]">
                    {u.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{u.full_name || "Unknown User"}</p>
                    <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                  </div>
                </div>
                <StartConversationButton otherUserId={u.id} currentUserId={user.id} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
