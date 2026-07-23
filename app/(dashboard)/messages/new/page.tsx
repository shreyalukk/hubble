import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewMessageClient } from "./new-message-client";

export default async function NewMessagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch users from database
  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, role")
    .neq("id", user.id)
    .limit(100);

  return (
    <NewMessageClient 
      users={users || []} 
      currentUserId={user.id} 
    />
  );
}
