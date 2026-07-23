"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, KeyRound, Lock, X, CheckCircle, ShieldAlert } from "lucide-react";
import { GroupCard } from "@/components/dashboard/group-card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GroupsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [myJoinedHubIds, setMyJoinedHubIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Modal State for Passcode Join
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [targetHubId, setTargetHubId] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const supabase = createClient();

  const loadGroupsAndMemberships = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data: memberships } = await supabase
        .from("hub_members")
        .select("hub_id")
        .eq("user_id", user.id);

      if (memberships) {
        setMyJoinedHubIds(new Set(memberships.map((m) => m.hub_id)));
      }
    }

    const { data } = await supabase.from("hubs").select("*");
    if (data) {
      const formatted = data.map((hub: any, i: number) => ({
        id: hub.id,
        type: hub.privacy === "public" ? "PUBLIC GROUP" : "PRIVATE GROUP",
        privacy: hub.privacy,
        title: hub.name,
        description: hub.description,
        passcode: hub.passcode,
        activeText: "Active recently",
        membersCount: Math.floor(Math.random() * 20) + 3,
        illustrationId: (i % 9) + 1,
      }));
      setGroups(formatted);
    }
  };

  useEffect(() => {
    loadGroupsAndMemberships();
  }, [supabase]);

  const handleOpenJoinModal = (hubId?: string) => {
    setTargetHubId(hubId || null);
    setPasscodeInput("");
    setJoinError("");
    setJoinSuccess("");
    setIsPasscodeModalOpen(true);
  };

  const handleJoinWithPasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;

    setIsJoining(true);
    setJoinError("");
    setJoinSuccess("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setJoinError("You must be logged in to join a group.");
        setIsJoining(false);
        return;
      }

      const cleanCode = passcodeInput.trim().toUpperCase();

      let targetHub = null;

      if (targetHubId) {
        // Look up target hub directly
        const { data: hub } = await supabase
          .from("hubs")
          .select("*")
          .eq("id", targetHubId)
          .single();
        targetHub = hub;
      } else {
        // Search by passcode across all hubs
        const { data: hubs } = await supabase
          .from("hubs")
          .select("*")
          .ilike("passcode", cleanCode);
        
        if (hubs && hubs.length > 0) {
          targetHub = hubs[0];
        }
      }

      if (!targetHub) {
        setJoinError("Invalid Passcode or Group Code. Please check with the group owner.");
        setIsJoining(false);
        return;
      }

      // Verify passcode match if hub is private
      if (targetHub.privacy !== "public") {
        if (!targetHub.passcode || targetHub.passcode.toUpperCase() !== cleanCode) {
          setJoinError("Incorrect passcode for this private group.");
          setIsJoining(false);
          return;
        }
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from("hub_members")
        .select("hub_id")
        .eq("hub_id", targetHub.id)
        .eq("user_id", user.id)
        .single();

      if (!existing) {
        const { error: joinErr } = await supabase.from("hub_members").insert({
          hub_id: targetHub.id,
          user_id: user.id,
          role: "member",
        });

        if (joinErr) {
          console.error("Error joining hub:", joinErr);
          setJoinError(`Failed to join: ${joinErr.message}`);
          setIsJoining(false);
          return;
        }
      }

      setJoinSuccess(`Successfully joined "${targetHub.name}"!`);
      await loadGroupsAndMemberships();

      setTimeout(() => {
        setIsPasscodeModalOpen(false);
        router.push(`/hubs/${targetHub.id}/channels/general`);
      }, 1200);

    } catch (err: any) {
      console.error(err);
      setJoinError("An error occurred. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinPublic = async (hubId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("hub_members").insert({
        hub_id: hubId,
        user_id: user.id,
        role: "member",
      });

      if (!error || error.code === "23505") { // 23505 = duplicate primary key
        await loadGroupsAndMemberships();
        router.push(`/hubs/${hubId}/channels/general`);
      } else {
        console.error("Failed to join public group:", error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGroupCardJoinClick = (hubId: string, isPrivate: boolean) => {
    if (isPrivate) {
      handleOpenJoinModal(hubId);
    } else {
      handleJoinPublic(hubId);
    }
  };

  const tabs = [
    { label: "All Groups", count: groups.length },
    { label: "My Groups", count: groups.filter((g) => myJoinedHubIds.has(g.id)).length },
    { label: "Public", count: groups.filter((g) => g.type === "PUBLIC GROUP").length },
    { label: "Private", count: groups.filter((g) => g.type === "PRIVATE GROUP").length },
  ];

  const filteredGroups = groups.filter((g) => {
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 1) return myJoinedHubIds.has(g.id);
    if (activeTab === 2) return g.type === "PUBLIC GROUP";
    if (activeTab === 3) return g.type === "PRIVATE GROUP";
    return true;
  });

  return (
    <div className="w-full flex flex-col min-h-full">
      {/* Page Title & Main Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Groups
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Discover public college groups or join private groups with a passcode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenJoinModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors shadow-xs"
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Join with Passcode</span>
          </button>

          <Link
            href="/hubs/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Group</span>
          </Link>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E8DDD0]">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === index ? "bg-[#2D2D2D] text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === index ? "bg-white/20 text-white" : "bg-[#F3EEEA] text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
                className="h-10 pl-10 pr-4 rounded-xl text-sm outline-none w-56 transition-all bg-white border border-[#E8DDD0] text-[#1a1a1a]"
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#E8DDD0] text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            {...group}
            isJoined={myJoinedHubIds.has(group.id)}
            onJoinClick={handleGroupCardJoinClick}
          />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DDD0]">
          <p className="text-lg font-semibold mb-2 text-[#1a1a1a]">No groups found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search filters or join a private group using a passcode.
          </p>
        </div>
      )}

      {/* Passcode Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsPasscodeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Join Private Group</h3>
                <p className="text-xs text-gray-500">
                  Enter the passcode or private code provided by the group creator
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinWithPasscodeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5 uppercase tracking-wider">
                  Passcode / Join Code
                </label>
                <input
                  type="text"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HUB-98X2F or MYSECRET123"
                  required
                  autoFocus
                  className="w-full h-11 px-4 rounded-xl text-base font-mono font-bold tracking-wider outline-none bg-gray-50 border border-[#E8DDD0] focus:border-blue-500 uppercase transition-all"
                />
              </div>

              {joinError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              {joinSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{joinSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasscodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining || !passcodeInput.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>{isJoining ? "Verifying..." : "Join Group"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
