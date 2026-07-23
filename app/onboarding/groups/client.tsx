"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Hub {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Props {
  hubs: Hub[];
  userId: string;
}

export default function GroupSelectionClient({ hubs, userId }: Props) {
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
          hub_id: id,
          role: "member",
        }));

        const { error } = await supabase.from("hub_members").insert(inserts);

        if (error) {
          console.error("Error saving hubs:", error);
          alert("Failed to save your selections. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {hubs.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-gray-500 mb-6">There aren't any groups in your selected communities yet.</p>
          <Link href="/hubs/new">
            <Button className="px-6 py-4 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Be the first to create one
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => {
            const isSelected = selectedIds.includes(hub.id);
            return (
              <div
                key={hub.id}
                onClick={() => toggleSelection(hub.id)}
                className={`cursor-pointer rounded-xl p-6 transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent bg-white dark:bg-gray-800 hover:border-blue-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {hub.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
                      {hub.name}
                    </h3>
                    <p className="text-xs text-gray-500">{hub.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {hub.description || "No description provided."}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 mt-10">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="px-8 py-6 text-lg rounded-full min-w-[200px]"
        >
          {isSubmitting ? "Saving..." : "Continue to Dashboard"}
        </Button>

        {hubs.length > 0 && (
          <Link href="/hubs/new" className="text-sm text-gray-500 hover:text-gray-900 hover:underline">
            Can't find what you're looking for? Create a new group.
          </Link>
        )}
      </div>
    </div>
  );
}
