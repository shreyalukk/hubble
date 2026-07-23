"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Download,
  Upload,
  Search,
  Plus,
  FolderArchive,
  ExternalLink,
  Sparkles,
  X,
  GraduationCap,
  Bookmark,
  Building2,
  FileSpreadsheet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface ResourceItem {
  id: string;
  title: string;
  department: string;
  fileUrl: string;
  fileType: string;
  authorOrSubject?: string;
  hubName?: string;
  uploaderName?: string;
  createdAt: string;
}

interface ResourcesClientProps {
  initialResources: ResourceItem[];
  currentUserId: string;
  hubs: { id: string; name: string }[];
}

const ENGINEERING_DEPARTMENTS = [
  "All Departments",
  "CSE (Computer Science)",
  "ISE (Information Science)",
  "ECE (Electronics & Comm)",
  "EEE (Electrical & Electronics)",
  "ME (Mechanical Engg)",
  "CIVIL (Civil Engg)",
  "AI & DS (AI & Data Science)",
];

const RESOURCE_TYPES = [
  "All Types",
  "Reference Book",
  "PYQ (Question Paper)",
  "Lecture Notes",
  "Lab Manual & Code",
];

export function ResourcesClient({
  initialResources,
  currentUserId,
  hubs,
}: ResourcesClientProps) {
  const supabase = createClient();
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedType, setSelectedType] = useState<string>("All Types");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("CSE (Computer Science)");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("Reference Book");
  const [authorOrSubject, setAuthorOrSubject] = useState("");
  const [selectedHubId, setSelectedHubId] = useState(hubs[0]?.id || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setIsUploading(true);

    try {
      const selectedHub = hubs.find((h) => h.id === selectedHubId);

      const { data: newRes, error } = await supabase
        .from("resources")
        .insert({
          title: authorOrSubject ? `${title} (${authorOrSubject})` : title,
          file_url: fileUrl,
          file_type: fileType,
          hub_id: selectedHubId || null,
          uploaded_by: currentUserId,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to upload resource: ${error.message}`);
        setIsUploading(false);
        return;
      }

      if (newRes) {
        const formatted: ResourceItem = {
          id: newRes.id,
          title: newRes.title,
          department: department,
          fileUrl: newRes.file_url,
          fileType: newRes.file_type || "Reference Book",
          authorOrSubject: authorOrSubject || "Faculty & Peer Shared",
          hubName: selectedHub?.name || "Campus Library",
          uploaderName: "You",
          createdAt: "Just now",
        };

        setResources((prev) => [formatted, ...prev]);
        setIsModalOpen(false);

        // Reset form
        setTitle("");
        setFileUrl("");
        setAuthorOrSubject("");
      }
    } catch (err) {
      console.error("Error uploading resource:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.authorOrSubject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.hubName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All Departments" || r.department.includes(selectedDepartment.split(" ")[0]);

    const matchesType = selectedType === "All Types" || r.fileType === selectedType;

    return matchesSearch && matchesDepartment && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Engineering Books & PYQ Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5C542]/20 text-[#D4A017]">
              All Departments
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Select your department to access reference textbooks, solved PYQ papers, and lecture notes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#F5C542]" />
          <span>Upload Book / PYQ</span>
        </button>
      </div>

      {/* Department Selector Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-[#F5C542]" />
          Select Department:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {ENGINEERING_DEPARTMENTS.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#2D2D2D] text-white shadow-sm"
                    : "bg-white border border-[#E8DDD0] text-gray-700 hover:bg-gray-50"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Resource Type Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E8DDD0]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search book title, author, or PYQ year..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm outline-none bg-gray-50 border border-transparent focus:border-[#F5C542] text-[#1a1a1a] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => {
          const isPYQ = res.fileType.includes("PYQ");
          const isBook = res.fileType.includes("Book");

          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white border border-[#E8DDD0] hover:border-[#F5C542] transition-all shadow-xs flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isPYQ
                      ? "bg-amber-100 text-amber-800"
                      : isBook
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isPYQ ? (
                    <FileSpreadsheet className="w-5 h-5" />
                  ) : isBook ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        isPYQ
                          ? "bg-amber-100 text-amber-900"
                          : isBook
                          ? "bg-blue-100 text-blue-900"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {res.fileType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                      {res.department}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">
                    {res.title}
                  </h3>

                  {res.authorOrSubject && (
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Author / Subject: {res.authorOrSubject}
                    </p>
                  )}

                  <p className="text-[11px] text-gray-400">
                    Uploaded by {res.uploaderName || "Faculty"} • {res.createdAt}
                  </p>
                </div>
              </div>

              <a
                href={res.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-[#2D2D2D] hover:text-white text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                title="View / Download PDF"
              >
                <span>Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <FolderArchive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">No resources found for this department</h3>
          <p className="text-xs text-gray-400 mb-4">
            Try changing the department filter or upload a book/PYQ!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5C542] text-white text-xs font-semibold rounded-xl hover:bg-[#e5b532] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Reference Book or PYQ</span>
          </button>
        </div>
      )}

      {/* Upload Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Upload Book or PYQ</h3>
                <p className="text-xs text-gray-500">Share reference textbooks & question papers</p>
              </div>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Title (Book Name / PYQ Year) <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating System Concepts or 2024 End-Sem Data Structures PYQ"
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Department <span className="text-[#F5C542]">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  >
                    {ENGINEERING_DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Resource Type <span className="text-[#F5C542]">*</span>
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  >
                    {RESOURCE_TYPES.filter((t) => t !== "All Types").map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Author Name / Subject Code
                </label>
                <input
                  type="text"
                  value={authorOrSubject}
                  onChange={(e) => setAuthorOrSubject(e.target.value)}
                  placeholder="e.g. Silberschatz & Galvin or CS301"
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  PDF / Google Drive Link <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !title || !fileUrl}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Uploading..." : "Share Book / PYQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
