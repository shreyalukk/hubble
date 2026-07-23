"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Community {
  id: string;
  name: string;
  description: string;
}

interface Props {
  communities: Community[];
  userId: string;
}

export default function CommunitySelectionClient({ communities, userId }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    setIsSubmitting(true);

    try {
      if (selectedIds.length > 0) {
        const inserts = selectedIds.map((id) => ({
          user_id: userId,
          community_id: id,
        }));

        const { error } = await supabase.from("user_communities").insert(inserts);

        if (error) {
          console.error("Error saving communities:", error);
          alert("Failed to save your selections. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      
      router.push("/onboarding/groups");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => {
          const isSelected = selectedIds.includes(community.id);
          return (
            <div
              key={community.id}
              onClick={() => toggleSelection(community.id)}
              className={`cursor-pointer rounded-xl p-6 transition-all duration-200 border-2 ${
                isSelected
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent bg-white dark:bg-gray-800 hover:border-blue-300 shadow-sm"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {community.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {community.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="px-8 py-6 text-lg rounded-full"
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
