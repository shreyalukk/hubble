"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, KeyRound, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function generateRandomPasscode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "HUB-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const privacyOptions = [
  { 
    value: "public", 
    label: "Public Group", 
    desc: "Anyone in your college can join directly", 
    icon: Globe, 
    color: "#F5C542" 
  },
  { 
    value: "private", 
    label: "Private (Passcode)", 
    desc: "Auto-generated or custom passcode required to join", 
    icon: Lock, 
    color: "#4285F4" 
  },
];

export default function CreateHubPage() {
  const router = useRouter();
  const supabase = createClient();
  const [communities, setCommunities] = useState<any[]>([]);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [category, setCategory] = useState("");
  const [passcode, setPasscode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // When switching to private, auto-generate passcode if empty
  useEffect(() => {
    if ((privacy === "private" || privacy === "passcode_protected") && !passcode) {
      setPasscode(generateRandomPasscode());
    }
  }, [privacy, passcode]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("users").select("college_id").eq("id", user.id).maybeSingle();
        if (profile?.college_id) {
          setCollegeId(profile.college_id);
        } else {
          const { data: firstCol } = await supabase.from("colleges").select("id").limit(1).maybeSingle();
          if (firstCol?.id) setCollegeId(firstCol.id);
        }
      }

      const { data: comms } = await supabase.from("communities").select("*");
      if (comms && comms.length > 0) {
        setCommunities(comms);
        setCategory(comms[0].name);
      }
    }
    loadData();
  }, [supabase]);

  const handleRegenerateCode = () => {
    setPasscode(generateRandomPasscode());
  };

  const handleCopyCode = () => {
    if (!passcode) return;
    navigator.clipboard.writeText(passcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetCollegeId = collegeId;
    if (!targetCollegeId) {
      const { data: firstCol } = await supabase.from("colleges").select("id").limit(1).maybeSingle();
      if (firstCol?.id) {
        targetCollegeId = firstCol.id;
      }
    }

    if ((privacy === "private" || privacy === "passcode_protected") && !passcode.trim()) {
      alert("Please specify or generate a passcode for this private group.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const finalPasscode = (privacy === "private" || privacy === "passcode_protected") 
        ? passcode.trim().toUpperCase() 
        : null;

      // 1. Insert Hub
      const { data: hub, error: hubError } = await supabase
        .from("hubs")
        .insert([
          {
            name,
            description,
            privacy,
            passcode: finalPasscode,
            category: category || "General",
            college_id: targetCollegeId,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (hubError) {
        console.error("Error creating hub:", hubError);
        alert(`Failed to create Hub: ${hubError.message}`);
        return;
      }

      if (hub) {
        // 2. Add creator as admin member
        await supabase.from("hub_members").insert({
          hub_id: hub.id,
          user_id: user.id,
          role: "admin"
        });

        // 3. Create default general channel
        await supabase.from("channels").insert({
          hub_id: hub.id,
          name: "general",
          type: "text"
        });

        router.push("/groups");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong creating the group.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#FAF6F0",
    border: "1.5px solid #E8DDD0",
    color: "#1a1a1a",
  };

  const isPrivateSelected = privacy === "private" || privacy === "passcode_protected";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:opacity-70 text-gray-500"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1a1a1a]">
        Create a New Group
      </h1>
      <p className="text-sm mb-8 text-gray-500">
        Create a public group for your college or a private group protected by a passcode.
      </p>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl p-8 space-y-6 bg-white border border-[#E8DDD0] shadow-sm"
      >
        {/* Hub Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Group Name <span className="text-[#F5C542]">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AI & Robotics Research Group"
            required
            className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#F5C542]"
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this group about?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none focus:border-[#F5C542]"
            style={inputStyle}
          />
        </div>

        {/* Community Selection */}
        {communities.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Community Category <span className="text-[#F5C542]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#F5C542]"
              style={inputStyle}
            >
              {communities.map((comm) => (
                <option key={comm.id} value={comm.name}>
                  {comm.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Privacy Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Group Privacy <span className="text-[#F5C542]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {privacyOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = privacy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPrivacy(opt.value);
                    if (opt.value === "private" && !passcode) {
                      setPasscode(generateRandomPasscode());
                    }
                  }}
                  className="flex flex-col items-start p-4 rounded-xl transition-all duration-200 text-left"
                  style={{
                    backgroundColor: selected ? `${opt.color}10` : "#FAF6F0",
                    border: selected ? `2px solid ${opt.color}` : "2px solid #E8DDD0",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-5 h-5" style={{ color: selected ? opt.color : "#9CA3AF" }} />
                    <span className="text-sm font-semibold text-[#1a1a1a]">{opt.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passcode Configuration Box for Private Group */}
        {isPrivateSelected && (
          <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">
                  Private Join Code / Passcode
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                Shareable Code
              </span>
            </div>

            <p className="text-xs text-blue-700 leading-relaxed">
              An immediate join code was generated below. You can also edit it to set a <strong>custom passcode of your choice</strong> (e.g. MYSECRET123). Anyone with this passcode can join your private group.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                placeholder="Enter custom passcode..."
                className="flex-1 h-11 px-4 rounded-xl text-base font-mono font-bold tracking-wider outline-none bg-white border border-blue-300 text-blue-950 focus:border-blue-500 uppercase"
              />

              <button
                type="button"
                onClick={handleRegenerateCode}
                className="h-11 px-3 bg-white border border-blue-200 hover:bg-blue-100/50 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Generate new random passcode"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto Code</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                className="h-11 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Copy passcode"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#F3EEEA]">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !name}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-all duration-200 disabled:opacity-40 shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F5C542]" />
            <span>{loading ? "Creating Group..." : "Create Group"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
