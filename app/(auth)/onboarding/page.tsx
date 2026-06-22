"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Check,
  Search,
} from "lucide-react";

/* ───────── Data ───────── */

const COLLEGES = [
  "RV College of Engineering, Bangalore",
  "PES University, Bangalore",
  "BMS College of Engineering, Bangalore",
  "M.S. Ramaiah Institute of Technology, Bangalore",
  "NITK Surathkal",
  "Manipal Institute of Technology, Manipal",
  "Christ University, Bangalore",
  "Jain University, Bangalore",
  "KLE Technological University, Hubli",
  "Nitte Meenakshi Institute of Technology, Bangalore",
  "Dayananda Sagar College of Engineering, Bangalore",
  "New Horizon College of Engineering, Bangalore",
  "Siddaganga Institute of Technology, Tumkur",
  "B.M.S. Institute of Technology, Bangalore"
];

const STUDENT_DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Psychology",
  "English Literature",
  "Economics",
];

const TEACHER_DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business & Management",
  "Sciences",
  "Mathematics",
  "Humanities",
  "Social Sciences",
  "Arts & Design",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year (Integrated)", "Postgraduate"];

const STUDENT_INTERESTS = [
  "AI & Machine Learning",
  "Web Development",
  "Mobile Apps",
  "Data Science",
  "Robotics",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Game Dev",
  "Open Source",
  "UI/UX Design",
  "Competitive Programming",
  "Finance & Trading",
  "Music",
  "Sports",
  "Photography",
  "Entrepreneurship",
  "Social Impact",
];

const TEACHER_SUBJECTS = [
  "Data Structures & Algorithms",
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Machine Learning",
  "Discrete Mathematics",
  "Digital Electronics",
  "Thermodynamics",
  "Engineering Mechanics",
  "Calculus",
  "Linear Algebra",
  "Probability & Statistics",
  "Research Methodology",
  "Technical Writing",
];

const EXPERIENCE_LEVELS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

/* ───────── SVG Illustrations ───────── */

function StudentIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
      <circle cx="60" cy="50" r="18" fill="#F5D0A9" />
      <path d="M42 46 Q44 30 60 28 Q76 30 78 46" fill="#2D2D2D" />
      <circle cx="54" cy="50" r="2" fill="#2D2D2D" />
      <circle cx="66" cy="50" r="2" fill="#2D2D2D" />
      <path d="M55 58 Q60 63 65 58" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M40 75 Q40 100 60 105 Q80 100 80 75 Z" fill="#F5C542" />
      <rect x="50" y="105" width="6" height="15" rx="3" fill="#2D2D2D" />
      <rect x="64" y="105" width="6" height="15" rx="3" fill="#2D2D2D" />
      {/* Backpack */}
      <rect x="78" y="78" width="14" height="22" rx="5" fill="#E8DDD0" stroke="#2D2D2D" strokeWidth="1" />
      {/* Book in hand */}
      <rect x="28" y="85" width="16" height="12" rx="2" fill="#4285F4" transform="rotate(-15 36 91)" />
    </svg>
  );
}

function TeacherIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
      <circle cx="60" cy="50" r="18" fill="#D4A574" />
      <path d="M42 46 Q44 30 60 28 Q76 30 78 46 Q76 36 60 34 Q44 36 42 46Z" fill="#2D2D2D" />
      {/* Glasses */}
      <circle cx="53" cy="50" r="6" stroke="#2D2D2D" strokeWidth="1.5" fill="none" />
      <circle cx="67" cy="50" r="6" stroke="#2D2D2D" strokeWidth="1.5" fill="none" />
      <line x1="59" y1="50" x2="61" y2="50" stroke="#2D2D2D" strokeWidth="1.5" />
      <path d="M55 60 Q60 64 65 60" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Suit body */}
      <path d="M40 75 Q40 100 60 105 Q80 100 80 75 Z" fill="#2D2D2D" />
      {/* Tie */}
      <polygon points="58,75 62,75 61,95 59,95" fill="#F5C542" />
      <rect x="50" y="105" width="6" height="15" rx="3" fill="#555" />
      <rect x="64" y="105" width="6" height="15" rx="3" fill="#555" />
      {/* Pointer stick */}
      <line x1="80" y1="80" x2="100" y2="60" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Styles ───────── */

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  borderRadius: "12px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#FAF6F0",
  border: "1.5px solid #E8DDD0",
  color: "#1a1a1a",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

/* ───────── Component ───────── */

type Role = "" | "student" | "teacher";

interface OnboardingData {
  role: Role;
  college: string;
  collegeSearch: string;
  department: string;
  year: string;
  interests: string[];
  subjects: string[];
  experience: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    role: "",
    college: "",
    collegeSearch: "",
    department: "",
    year: "",
    interests: [],
    subjects: [],
    experience: "",
  });

  const router = useRouter();

  const isStudent = data.role === "student";
  const isTeacher = data.role === "teacher";

  // Total steps: 1 (role) + 2 (college) + 3 (department + year/experience) + 4 (interests/subjects)
  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 1: return data.role !== "";
      case 2: return data.college !== "";
      case 3:
        if (isStudent) return data.department !== "" && data.year !== "";
        if (isTeacher) return data.department !== "" && data.experience !== "";
        return false;
      case 4:
        if (isStudent) return data.interests.length >= 2;
        if (isTeacher) return data.subjects.length >= 1;
        return false;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // TODO: Save onboarding data to Supabase user profile
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const filteredColleges = data.collegeSearch
    ? COLLEGES.filter((c) => c.toLowerCase().includes(data.collegeSearch.toLowerCase()))
    : COLLEGES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#2D2D2D" }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>hubble</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: "#E8DDD0" }}>

        {/* Progress Bar */}
        <div className="w-full h-1.5" style={{ backgroundColor: "#F3EEEA" }}>
          <motion.div
            className="h-full rounded-r-full"
            style={{ backgroundColor: "#F5C542" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-6 px-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: s === step ? "#F5C542" : s < step ? "#2D2D2D" : "#E8DDD0",
                transform: s === step ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="p-8 pt-6">

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >

              {/* ─── STEP 1: Role Selection ─── */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Tell us about yourself
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      How would you like to use Hubble?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Student Card */}
                    <button
                      onClick={() => setData({ ...data, role: "student" })}
                      className="relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 group"
                      style={{
                        backgroundColor: isStudent ? "#FFFDF7" : "#FAF6F0",
                        border: isStudent ? "2px solid #F5C542" : "2px solid #E8DDD0",
                        boxShadow: isStudent ? "0 4px 20px rgba(245,197,66,0.15)" : "none",
                      }}
                    >
                      {isStudent && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F5C542" }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="mb-4">
                        <StudentIllustration />
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: isStudent ? "#F5C542" : "#E8DDD0" }}>
                        <GraduationCap className="w-5 h-5" style={{ color: isStudent ? "#1a1a1a" : "#6b7280" }} />
                      </div>
                      <h3 className="font-bold text-base mb-1" style={{ color: "#1a1a1a" }}>Student</h3>
                      <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                        Join classes, clubs & communities
                      </p>
                    </button>

                    {/* Teacher Card */}
                    <button
                      onClick={() => setData({ ...data, role: "teacher" })}
                      className="relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 group"
                      style={{
                        backgroundColor: isTeacher ? "#FFFDF7" : "#FAF6F0",
                        border: isTeacher ? "2px solid #F5C542" : "2px solid #E8DDD0",
                        boxShadow: isTeacher ? "0 4px 20px rgba(245,197,66,0.15)" : "none",
                      }}
                    >
                      {isTeacher && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F5C542" }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="mb-4">
                        <TeacherIllustration />
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: isTeacher ? "#F5C542" : "#E8DDD0" }}>
                        <BookOpen className="w-5 h-5" style={{ color: isTeacher ? "#1a1a1a" : "#6b7280" }} />
                      </div>
                      <h3 className="font-bold text-base mb-1" style={{ color: "#1a1a1a" }}>Teacher</h3>
                      <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                        Create courses & manage groups
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: College Selection ─── */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Select your college
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      You&apos;ll automatically join your college&apos;s community
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <input
                      type="text"
                      placeholder="Search for your college..."
                      value={data.collegeSearch}
                      onChange={(e) => setData({ ...data, collegeSearch: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "#FAF6F0",
                        border: "1.5px solid #E8DDD0",
                        color: "#1a1a1a",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#F5C542")}
                      onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")}
                    />
                  </div>

                  {/* College List */}
                  <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredColleges.map((college) => {
                      const selected = data.college === college;
                      return (
                        <button
                          key={college}
                          onClick={() => setData({ ...data, college })}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-200"
                          style={{
                            backgroundColor: selected ? "#FFFDF7" : "#FAF6F0",
                            border: selected ? "1.5px solid #F5C542" : "1.5px solid transparent",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{
                                backgroundColor: selected ? "#F5C542" : "#E8DDD0",
                                color: selected ? "#1a1a1a" : "#6b7280",
                              }}
                            >
                              {college.charAt(0)}
                            </div>
                            <span className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                              {college}
                            </span>
                          </div>
                          {selected && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F5C542" }}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {filteredColleges.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm" style={{ color: "#9CA3AF" }}>No colleges found. Try a different search.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Role-specific Details ─── */}
              {step === 3 && isStudent && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Academic details
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Help us connect you with the right peers
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#374151" }}>
                        Department / Major <span style={{ color: "#F5C542" }}>*</span>
                      </label>
                      <select
                        style={selectStyle}
                        value={data.department}
                        onChange={(e) => setData({ ...data, department: e.target.value })}
                      >
                        <option value="">Select your department</option>
                        {STUDENT_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#374151" }}>
                        Year of Study <span style={{ color: "#F5C542" }}>*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {YEARS.map((year) => {
                          const selected = data.year === year;
                          return (
                            <button
                              key={year}
                              onClick={() => setData({ ...data, year })}
                              className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                              style={{
                                backgroundColor: selected ? "#2D2D2D" : "#FAF6F0",
                                color: selected ? "#FFFFFF" : "#374151",
                                border: selected ? "1.5px solid #2D2D2D" : "1.5px solid #E8DDD0",
                              }}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && isTeacher && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Professional details
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Tell us about your teaching background
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#374151" }}>
                        Department <span style={{ color: "#F5C542" }}>*</span>
                      </label>
                      <select
                        style={selectStyle}
                        value={data.department}
                        onChange={(e) => setData({ ...data, department: e.target.value })}
                      >
                        <option value="">Select your department</option>
                        {TEACHER_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#374151" }}>
                        Teaching Experience <span style={{ color: "#F5C542" }}>*</span>
                      </label>
                      <div className="space-y-2">
                        {EXPERIENCE_LEVELS.map((exp) => {
                          const selected = data.experience === exp;
                          return (
                            <button
                              key={exp}
                              onClick={() => setData({ ...data, experience: exp })}
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                              style={{
                                backgroundColor: selected ? "#FFFDF7" : "#FAF6F0",
                                border: selected ? "1.5px solid #F5C542" : "1.5px solid #E8DDD0",
                                color: "#374151",
                              }}
                            >
                              {exp}
                              {selected && (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F5C542" }}>
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── STEP 4: Interests / Subjects ─── */}
              {step === 4 && isStudent && (
                <div>
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Pick your interests
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Select at least 2 topics you&apos;re into. We&apos;ll suggest communities for you.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {STUDENT_INTERESTS.map((interest) => {
                      const selected = data.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => setData({ ...data, interests: toggleItem(data.interests, interest) })}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: selected ? "#2D2D2D" : "#FAF6F0",
                            color: selected ? "#FFFFFF" : "#374151",
                            border: selected ? "1.5px solid #2D2D2D" : "1.5px solid #E8DDD0",
                          }}
                        >
                          {selected && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs mt-4 text-center" style={{ color: data.interests.length >= 2 ? "#34A853" : "#9CA3AF" }}>
                    {data.interests.length}/2 minimum selected
                  </p>
                </div>
              )}

              {step === 4 && isTeacher && (
                <div>
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
                      Subjects you teach
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Select the subjects you teach or are interested in
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {TEACHER_SUBJECTS.map((subject) => {
                      const selected = data.subjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          onClick={() => setData({ ...data, subjects: toggleItem(data.subjects, subject) })}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: selected ? "#2D2D2D" : "#FAF6F0",
                            color: selected ? "#FFFFFF" : "#374151",
                            border: selected ? "1.5px solid #2D2D2D" : "1.5px solid #E8DDD0",
                          }}
                        >
                          {selected && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                          {subject}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs mt-4 text-center" style={{ color: data.subjects.length >= 1 ? "#34A853" : "#9CA3AF" }}>
                    {data.subjects.length} selected
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ─── Navigation ─── */}
          <div className="flex justify-between items-center pt-6 mt-6" style={{ borderTop: "1px solid #F3EEEA" }}>
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30"
              style={{ color: "#6b7280" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                Step {step} of {totalSteps}
              </span>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40"
                style={{ backgroundColor: canProceed() ? "#2D2D2D" : "#9CA3AF" }}
              >
                {step === totalSteps ? "Get Started 🚀" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
