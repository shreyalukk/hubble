"use client";

import { useState } from "react";
import { Megaphone, Pin, Calendar, Plus, X, Sparkles, Tag, ShieldCheck, Trophy, Briefcase, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  posterName: string;
  date: string;
}

interface AnnouncementsClientProps {
  initialAnnouncements: AnnouncementItem[];
  userRole: "teacher" | "student" | "admin";
  currentUserId: string;
}

export function AnnouncementsClient({
  initialAnnouncements,
  userRole,
  currentUserId,
}: AnnouncementsClientProps) {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("academic");
  const [isPinned, setIsPinned] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const canPost = userRole === "teacher" || userRole === "admin";

  const categories = [
    { key: "all", label: "All Notices" },
    { key: "hackathons & contests", label: "🚀 Hackathons & Contests" },
    { key: "internships & hiring", label: "💼 Internships & Hiring" },
    { key: "exams & timetables", label: "📅 Exams & Timetables" },
    { key: "academic", label: "🎓 Academic Circulars" },
  ];

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsPosting(true);

    try {
      const { data: newAnno, error } = await supabase
        .from("announcements")
        .insert({
          title,
          content,
          category,
          is_pinned: isPinned,
          posted_by: currentUserId,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to post notice: ${error.message}`);
        setIsPosting(false);
        return;
      }

      if (newAnno) {
        const formatted: AnnouncementItem = {
          id: newAnno.id,
          title: newAnno.title,
          content: newAnno.content,
          category: newAnno.category,
          isPinned: newAnno.is_pinned,
          posterName: "You (Faculty)",
          date: "Just now",
        };

        setAnnouncements((prev) => [formatted, ...prev]);
        setIsModalOpen(false);

        // Reset form
        setTitle("");
        setContent("");
        setIsPinned(false);
      }
    } catch (err) {
      console.error("Error posting announcement:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) => selectedCategory === "all" || a.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Campus Notice Board
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Verified Circulars
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Hackathon notifications, competitions, internship hiring drives & exam timetables
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#F5C542]" />
            <span>Post Circular</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? "bg-[#2D2D2D] text-white shadow-sm"
                : "bg-white border border-[#E8DDD0] text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((notice) => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl bg-white border transition-all shadow-xs space-y-3 ${
              notice.isPinned ? "border-amber-400 bg-amber-50/20" : "border-[#E8DDD0]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-600" /> Pinned Circular
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900">
                    {notice.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{notice.title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1 font-medium text-gray-600">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                {notice.posterName}
              </span>
              <span>{notice.date}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">No announcements in this category</h3>
          <p className="text-xs text-gray-400">Check back later for official campus updates.</p>
        </div>
      )}

      {/* Post Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Post Official Notice</h3>
                <p className="text-xs text-gray-500">Publish hackathons, internships, or exam circulars</p>
              </div>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Notice Title <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Christ University HackChrist v4.0 Announcement"
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Category <span className="text-[#F5C542]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                >
                  <option value="hackathons & contests">🚀 Hackathons & Contests</option>
                  <option value="internships & hiring">💼 Internships & Hiring</option>
                  <option value="exams & timetables">📅 Exams & Timetables</option>
                  <option value="academic">🎓 Academic Circular</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Notice Content <span className="text-[#F5C542]">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter complete details, registration links, prize pools, dates, or eligibility..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542] resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="pin" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Pin this circular to top of Notice Board
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting || !title || !content}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>{isPosting ? "Publishing..." : "Publish Notice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
