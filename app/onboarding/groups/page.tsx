import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GroupSelectionClient from "./client";

export default async function OnboardingGroupsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Get the communities the user joined
  const { data: userCommunities } = await supabase
    .from("user_communities")
    .select("community_id, communities(name)")
    .eq("user_id", user.id);

  const communityNames = userCommunities
    ?.map((uc: any) => uc.communities?.name)
    .filter(Boolean) || [];

  // 2. Fetch hubs that match these communities
  let hubs: any[] = [];
  if (communityNames.length > 0) {
    const { data } = await supabase
      .from("hubs")
      .select("*")
      .in("category", communityNames);
    if (data) hubs = data;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col pt-12 md:pt-20 px-6">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            Join your first groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Based on the communities you joined, here are some active groups you might like. You can join them now or create your own!
          </p>
        </div>

        {/* Client Component */}
        <GroupSelectionClient hubs={hubs} userId={user.id} />

      </div>
    </div>
  );
}
