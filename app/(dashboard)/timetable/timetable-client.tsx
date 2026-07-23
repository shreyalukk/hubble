"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, GraduationCap, FileSpreadsheet, Sparkles, CheckCircle } from "lucide-react";

const DEPARTMENTS = [
  "CSE (Computer Science)",
  "ISE (Information Science)",
  "ECE (Electronics & Comm)",
  "EEE (Electrical & Electronics)",
  "ME (Mechanical Engg)",
  "CIVIL (Civil Engg)",
  "AI & DS (AI & Data Science)",
];

const SEMESTERS = ["3rd Semester", "5th Semester", "7th Semester"];

// Default Timetables Data
const TIMETABLE_DATA: Record<string, Record<string, any>> = {
  "CSE (Computer Science)": {
    "3rd Semester": {
      weekly: [
        { day: "Monday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Data Structures & Algorithms", room: "CS-301", teacher: "Prof. Ananya Rao" },
          { time: "10:00 - 11:00 AM", subject: "Operating Systems", room: "CS-301", teacher: "Prof. Rajesh Sharma" },
          { time: "11:15 - 12:15 PM", subject: "Discrete Mathematics", room: "CS-301", teacher: "Dr. Mathur" },
          { time: "01:15 - 03:15 PM", subject: "Data Structures Lab", room: "Lab 3 (Ground Floor)", teacher: "Prof. Ananya Rao" },
        ]},
        { day: "Tuesday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Computer Organization & Arch", room: "CS-301", teacher: "Prof. Vikram" },
          { time: "10:00 - 11:00 AM", subject: "Data Structures & Algorithms", room: "CS-301", teacher: "Prof. Ananya Rao" },
          { time: "11:15 - 12:15 PM", subject: "Object Oriented Programming (Java)", room: "CS-301", teacher: "Prof. Meenakshi" },
          { time: "01:15 - 03:15 PM", subject: "Java Programming Lab", room: "Lab 2", teacher: "Prof. Meenakshi" },
        ]},
        { day: "Wednesday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Operating Systems", room: "CS-301", teacher: "Prof. Rajesh Sharma" },
          { time: "10:00 - 11:00 AM", subject: "Discrete Mathematics", room: "CS-301", teacher: "Dr. Mathur" },
          { time: "11:15 - 12:15 PM", subject: "Computer Organization & Arch", room: "CS-301", teacher: "Prof. Vikram" },
          { time: "01:15 - 02:15 PM", subject: "Universal Human Values", room: "Auditorium A", teacher: "Dr. Geeta" },
        ]},
        { day: "Thursday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Data Structures & Algorithms", room: "CS-301", teacher: "Prof. Ananya Rao" },
          { time: "10:00 - 11:00 AM", subject: "Object Oriented Programming (Java)", room: "CS-301", teacher: "Prof. Meenakshi" },
          { time: "11:15 - 12:15 PM", subject: "Operating Systems", room: "CS-301", teacher: "Prof. Rajesh Sharma" },
          { time: "01:15 - 03:15 PM", subject: "OS & Unix Shell Lab", room: "Lab 4", teacher: "Prof. Rajesh Sharma" },
        ]},
        { day: "Friday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Discrete Mathematics", room: "CS-301", teacher: "Dr. Mathur" },
          { time: "10:00 - 11:00 AM", subject: "Computer Organization & Arch", room: "CS-301", teacher: "Prof. Vikram" },
          { time: "11:15 - 12:15 PM", subject: "Technical Seminar / Mentoring", room: "CS-301", teacher: "Faculty Mentors" },
          { time: "01:15 - 03:15 PM", subject: "Sports / Placement Aptitude", room: "Sports Ground / Seminar Hall", teacher: "Placement Team" },
        ]},
      ],
      exam: [
        { date: "2026-11-16", day: "Monday", time: "09:30 AM - 12:30 PM", code: "21CS301", subject: "Data Structures & Algorithms", hall: "Exam Hall 101" },
        { date: "2026-11-18", day: "Wednesday", time: "09:30 AM - 12:30 PM", code: "21CS302", subject: "Operating Systems", hall: "Exam Hall 101" },
        { date: "2026-11-20", day: "Friday", time: "09:30 AM - 12:30 PM", code: "21CS303", subject: "Discrete Mathematics", hall: "Exam Hall 102" },
        { date: "2026-11-23", day: "Monday", time: "09:30 AM - 12:30 PM", code: "21CS304", subject: "Computer Organization & Architecture", hall: "Exam Hall 102" },
        { date: "2026-11-25", day: "Wednesday", time: "09:30 AM - 12:30 PM", code: "21CS305", subject: "Object Oriented Programming (Java)", hall: "Exam Hall 103" },
      ]
    },
    "5th Semester": {
      weekly: [
        { day: "Monday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Database Management Systems", room: "CS-501", teacher: "Prof. Kavita Nair" },
          { time: "10:00 - 11:00 AM", subject: "Computer Networks", room: "CS-501", teacher: "Prof. Ramesh" },
          { time: "11:15 - 12:15 PM", subject: "Theory of Computation (Automata)", room: "CS-501", teacher: "Dr. Sitaram" },
          { time: "01:15 - 03:15 PM", subject: "DBMS SQL Lab", room: "Lab 5", teacher: "Prof. Kavita Nair" },
        ]},
        { day: "Tuesday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Software Engineering", room: "CS-501", teacher: "Prof. Divya" },
          { time: "10:00 - 11:00 AM", subject: "Computer Networks", room: "CS-501", teacher: "Prof. Ramesh" },
          { time: "11:15 - 12:15 PM", subject: "Database Management Systems", room: "CS-501", teacher: "Prof. Kavita Nair" },
          { time: "01:15 - 03:15 PM", subject: "Networks Socket Lab", room: "Lab 1", teacher: "Prof. Ramesh" },
        ]},
      ],
      exam: [
        { date: "2026-11-17", day: "Tuesday", time: "09:30 AM - 12:30 PM", code: "21CS501", subject: "Database Management Systems", hall: "Exam Hall 201" },
        { date: "2026-11-19", day: "Thursday", time: "09:30 AM - 12:30 PM", code: "21CS502", subject: "Computer Networks", hall: "Exam Hall 201" },
        { date: "2026-11-21", day: "Saturday", time: "09:30 AM - 12:30 PM", code: "21CS503", subject: "Theory of Computation", hall: "Exam Hall 202" },
      ]
    }
  },
  "ECE (Electronics & Comm)": {
    "3rd Semester": {
      weekly: [
        { day: "Monday", slots: [
          { time: "09:00 - 10:00 AM", subject: "Analog Electronics", room: "EC-201", teacher: "Prof. Suresh Kumar" },
          { time: "10:00 - 11:00 AM", subject: "Signals & Systems", room: "EC-201", teacher: "Dr. Varun" },
          { time: "11:15 - 12:15 PM", subject: "Network Analysis", room: "EC-201", teacher: "Prof. Deepa" },
          { time: "01:15 - 03:15 PM", subject: "Analog Circuits Lab", room: "EC Circuits Lab", teacher: "Prof. Suresh Kumar" },
        ]},
      ],
      exam: [
        { date: "2026-11-16", day: "Monday", time: "09:30 AM - 12:30 PM", code: "21EC301", subject: "Analog Electronics", hall: "EC Block Hall A" },
        { date: "2026-11-18", day: "Wednesday", time: "09:30 AM - 12:30 PM", code: "21EC302", subject: "Signals & Systems", hall: "EC Block Hall A" },
      ]
    }
  }
};

export function TimetableClient() {
  const [selectedDept, setSelectedDept] = useState<string>("CSE (Computer Science)");
  const [selectedSem, setSelectedSem] = useState<string>("3rd Semester");
  const [activeTab, setActiveTab] = useState<"weekly" | "exam">("weekly");

  const deptData = TIMETABLE_DATA[selectedDept] || TIMETABLE_DATA["CSE (Computer Science)"];
  const semData = deptData[selectedSem] || deptData["3rd Semester"] || TIMETABLE_DATA["CSE (Computer Science)"]["3rd Semester"];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Class & Exam Timetables
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Academic Schedule
            </span>
          </div>
          <p className="text-xs text-gray-500">
            View weekly lecture schedules, classroom numbers, and semester examination dates per department
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8DDD0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wider">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-10 px-3.5 rounded-xl text-xs font-bold outline-none bg-gray-50 border border-[#E8DDD0] text-gray-800 cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wider">
              Semester
            </label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="h-10 px-3.5 rounded-xl text-xs font-bold outline-none bg-gray-50 border border-[#E8DDD0] text-gray-800 cursor-pointer"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "weekly"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Weekly Classes</span>
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "exam"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>End-Sem Exams</span>
          </button>
        </div>
      </div>

      {/* Weekly Class Timetable View */}
      {activeTab === "weekly" && (
        <div className="space-y-6">
          {(semData.weekly || []).map((dayGroup: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden shadow-xs">
              <div className="bg-[#2D2D2D] text-white px-5 py-3 flex items-center justify-between">
                <span className="font-bold text-sm tracking-wide">{dayGroup.day}</span>
                <span className="text-xs text-[#F5C542] font-semibold">{selectedDept} • {selectedSem}</span>
              </div>

              <div className="divide-y divide-[#E8DDD0]">
                {dayGroup.slots.map((slot: any, sIdx: number) => (
                  <div
                    key={sIdx}
                    className="p-4 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{slot.time}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#1a1a1a]">{slot.subject}</h4>
                        <p className="text-xs text-gray-500">Instructor: {slot.teacher}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg w-fit">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Classroom: {slot.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exam Timetable View */}
      {activeTab === "exam" && (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden shadow-xs">
          <div className="p-4 bg-blue-50 border-b border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between">
            <span>
              Official End-Semester Examination Schedule ({selectedDept} - {selectedSem})
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-950 text-[10px] font-bold">
              Final Timetable
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-[#E8DDD0] uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Date & Day</th>
                  <th className="p-4">Exam Session</th>
                  <th className="p-4">Course Code</th>
                  <th className="p-4">Subject Title</th>
                  <th className="p-4">Exam Hall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {(semData.exam || []).map((exam: any, eIdx: number) => (
                  <tr key={eIdx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-[#1a1a1a]">
                      {exam.date} ({exam.day})
                    </td>
                    <td className="p-4 font-medium text-gray-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {exam.time}
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-700">{exam.code}</td>
                    <td className="p-4 font-bold text-[#1a1a1a]">{exam.subject}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        {exam.hall}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
