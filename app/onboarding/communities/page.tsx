import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CommunitySelectionClient from "./client"; // IDE refresh

export default async function OnboardingCommunitiesPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all available communities
  const { data: communities } = await supabase
    .from("communities")
    .select("*")
    .order("name");

  // Check if user already has communities selected
  const { data: userCommunities } = await supabase
    .from("user_communities")
    .select("community_id")
    .eq("user_id", user.id);

  if (userCommunities && userCommunities.length > 0) {
    // User already completed onboarding
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Hubble!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Let&apos;s personalize your experience. Select the communities you are interested in.
          </p>
        </div>
        
        <CommunitySelectionClient 
          communities={communities || []} 
          userId={user.id} 
        />
      </div>
    </div>
  );
}
