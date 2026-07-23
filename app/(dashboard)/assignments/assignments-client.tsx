"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Upload,
  BookOpen,
  Award,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  points: number;
  hubName: string;
  hubId: string;
  submitted?: boolean;
  grade?: number | null;
  feedback?: string | null;
}

interface AssignmentsClientProps {
  initialAssignments: AssignmentItem[];
  userRole: "teacher" | "student" | "admin";
  currentUserId: string;
  hubs: { id: string; name: string }[];
}

export function AssignmentsClient({
  initialAssignments,
  userRole,
  currentUserId,
  hubs,
}: AssignmentsClientProps) {
  const supabase = createClient();
  const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "submitted">("all");

  // Create Assignment Modal (Teachers)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [points, setPoints] = useState(100);
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || "");
  const [isCreating, setIsCreating] = useState(false);

  // Submit Work Modal (Students)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [targetAssignment, setTargetAssignment] = useState<AssignmentItem | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = userRole === "teacher" || userRole === "admin";

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline || !selectedHubId) return;

    setIsCreating(true);

    try {
      const selectedHub = hubs.find((h) => h.id === selectedHubId);

      const { data: newAssign, error } = await supabase
        .from("assignments")
        .insert({
          title,
          description,
          deadline: new Date(deadline).toISOString(),
          points,
          hub_id: selectedHubId,
          created_by: currentUserId,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to create assignment: ${error.message}`);
        setIsCreating(false);
        return;
      }

      if (newAssign) {
        const formatted: AssignmentItem = {
          id: newAssign.id,
          title: newAssign.title,
          description: newAssign.description || "",
          deadline: new Date(newAssign.deadline).toLocaleString(),
          points: newAssign.points || 100,
          hubName: selectedHub?.name || "General Group",
          hubId: selectedHubId,
          submitted: false,
        };

        setAssignments((prev) => [formatted, ...prev]);
        setIsCreateModalOpen(false);

        // Reset form
        setTitle("");
        setDescription("");
        setDeadline("");
        setPoints(100);
      }
    } catch (err) {
      console.error("Error creating assignment:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenSubmitModal = (assign: AssignmentItem) => {
    setTargetAssignment(assign);
    setSubmissionContent("");
    setIsSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAssignment || !submissionContent.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("submissions").insert({
        assignment_id: targetAssignment.id,
        student_id: currentUserId,
        file_url: submissionContent.trim(),
        submitted_at: new Date().toISOString(),
      });

      if (error) {
        alert(`Failed to submit: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Mark as submitted locally
      setAssignments((prev) =>
        prev.map((a) => (a.id === targetAssignment.id ? { ...a, submitted: true } : a))
      );

      setIsSubmitModalOpen(false);
    } catch (err) {
      console.error("Error submitting assignment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === "pending") return !a.submitted;
    if (activeTab === "submitted") return a.submitted;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Assignments & Homework
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5C542]/20 text-[#D4A017]">
              Campus LMS
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {isTeacher
              ? "Publish homework, set deadlines & grade student submissions"
              : "Track course deadlines, submit homework & view graded feedback"}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#F5C542]" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 p-1 bg-white border border-[#E8DDD0] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "all" ? "bg-[#2D2D2D] text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          All ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "pending" ? "bg-[#2D2D2D] text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Pending ({assignments.filter((a) => !a.submitted).length})
        </button>
        <button
          onClick={() => setActiveTab("submitted")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "submitted" ? "bg-[#2D2D2D] text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Submitted ({assignments.filter((a) => a.submitted).length})
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assign) => (
          <div
            key={assign.id}
            className="p-6 rounded-2xl bg-white border border-[#E8DDD0] hover:border-[#F5C542]/50 transition-all shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                    {assign.hubName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {assign.points} Points
                  </span>
                  {assign.submitted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Submitted
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{assign.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{assign.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> Due: {assign.deadline}
                  </span>
                </div>
              </div>

              {!isTeacher && (
                <div className="shrink-0 self-start sm:self-center">
                  {assign.submitted ? (
                    <div className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmitModal(assign)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F5C542]" />
                      <span>Submit Assignment</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">No assignments found</h3>
          <p className="text-xs text-gray-400">
            {isTeacher
              ? "Click 'Create Assignment' to publish homework for your students."
              : "You are all caught up! No pending assignments found."}
          </p>
        </div>
      )}

      {/* Create Assignment Modal (Teachers) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Create Assignment</h3>
                <p className="text-xs text-gray-500">Publish course homework & set deadline</p>
              </div>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Assignment Title <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 4: Binary Search Trees Implementation"
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              {hubs.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Select Group / Course <span className="text-[#F5C542]">*</span>
                  </label>
                  <select
                    value={selectedHubId}
                    onChange={(e) => setSelectedHubId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  >
                    {hubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Instructions & Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details, submission guidelines, or link to problem statement..."
                  rows={3}
                  className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Due Date & Time <span className="text-[#F5C542]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 100)}
                    className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !title || !deadline}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>{isCreating ? "Publishing..." : "Publish Assignment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal (Students) */}
      {isSubmitModalOpen && targetAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Submit Assignment</h3>
                <p className="text-xs text-gray-500">{targetAssignment.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Submission File URL / Google Drive Link / Solution Notes <span className="text-[#F5C542]">*</span>
                </label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Paste link to Google Drive, GitHub repository, or write your answer here..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !submissionContent.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Confirm Submission"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
