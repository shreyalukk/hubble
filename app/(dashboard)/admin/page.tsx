import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Shield, Settings, Trash2 } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch user role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    // If not admin, redirect away
    redirect("/dashboard");
  }

  // Fetch some stats for the admin
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
    
  const { count: hubsCount } = await supabase
    .from("hubs")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading tracking-tight text-gray-900 flex items-center gap-2">
          <Shield className="w-8 h-8 text-[#F5C542]" />
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#E8DDD0] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-900">{usersCount || 0}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E8DDD0] rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Hubs</p>
              <h2 className="text-3xl font-bold text-gray-900">{hubsCount || 0}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-[#E8DDD0] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8DDD0]">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports / Actions</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-gray-400 py-12">
          <Trash2 className="w-12 h-12 mb-4 opacity-50" />
          <p>No moderation actions required at this time.</p>
        </div>
      </div>
    </div>
  );
}
