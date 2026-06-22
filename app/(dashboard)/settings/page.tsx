import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch full user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("id, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (!userProfile) {
    // Edge case if record doesn't exist
    return (
      <div className="max-w-4xl mx-auto py-10">
        <p>Could not load user profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
          Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings Section */}
        <ProfileForm user={userProfile} />
      </div>
    </div>
  );
}
