"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, KeyRound } from "lucide-react";
import Link from "next/link";

const privacyOptions = [
  { value: "public", label: "Public", desc: "Anyone in college can join", icon: Globe, color: "#F5C542" },
  { value: "private", label: "Private", desc: "Invite only", icon: Lock, color: "#4285F4" },
  { value: "passcode_protected", label: "Passcode", desc: "Join with passcode", icon: KeyRound, color: "#34A853" },
];

export default function CreateHubPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/groups");
    }, 1000);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#FAF6F0",
    border: "1.5px solid #E8DDD0",
    color: "#1a1a1a",
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:opacity-70"
        style={{ color: "#6b7280" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
        Create a New Hub
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Hubs are where your college communities live. Create one for a class, club, project, or just hanging out.
      </p>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl p-8 space-y-6"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
      >
        {/* Hub Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "#374151" }}>
            Hub Name <span style={{ color: "#F5C542" }}>*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Intro to Machine Learning"
            required
            className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#F5C542]"
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "#374151" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this hub about?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none focus:border-[#F5C542]"
            style={inputStyle}
          />
        </div>

        {/* Privacy */}
        <div className="space-y-3">
          <label className="text-sm font-medium" style={{ color: "#374151" }}>
            Privacy
          </label>
          <div className="grid grid-cols-3 gap-3">
            {privacyOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = privacy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPrivacy(opt.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: selected ? `${opt.color}10` : "#FAF6F0",
                    border: selected ? `2px solid ${opt.color}` : "2px solid #E8DDD0",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: selected ? opt.color : "#9CA3AF" }} />
                  <span className="text-xs font-semibold" style={{ color: "#1a1a1a" }}>{opt.label}</span>
                  <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #F3EEEA" }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#6b7280" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !name}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "#2D2D2D" }}
          >
            {loading ? "Creating..." : "Create Hub"}
          </button>
        </div>
      </form>
    </div>
  );
}
