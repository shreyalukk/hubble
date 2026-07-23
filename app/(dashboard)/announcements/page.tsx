import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnnouncementsClient, AnnouncementItem } from "./announcements-client";

const FEATURED_CAMPUS_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "anno-hackathon-christ-1",
    title: "🚀 HackChrist v4.0 - 36-Hour Flagship Hackathon at Christ University!",
    content: `Christ University Kengeri Campus is hosting HackChrist v4.0, a 36-Hour National Level Hackathon!\n\n• Prize Pool: ₹1,50,000 + Incubation Support\n• Tracks: AI/ML, Web3, FinTech, Open Innovation\n• Dates: September 12 - 14, 2026\n• Location: Academic Block 3, Christ University Campus\n\nRegistration link is open for all CSE, ISE, ECE, EEE & AI&DS students! Free accommodation & food provided.`,
    category: "hackathons & contests",
    isPinned: true,
    posterName: "Christ University Hackathon Committee",
    date: "2026-07-22",
  },
  {
    id: "anno-internship-1",
    title: "💼 Software Engineering Summer Internship 2026 - Off-Campus Drive",
    content: `Global Tech Corp is hiring Software Engineering Interns for Summer 2026.\n\n• Role: Full-Stack / Backend Engineering Intern\n• Stipend: ₹45,000 / month\n• Eligibility: 3rd & 4th Year B.Tech (CSE, ISE, ECE, AI&DS)\n• Skills Required: React, Node.js, Python/Java, Data Structures\n\nSubmit your CV on or before August 10th. Pre-placement interviews will follow online.`,
    category: "internships & hiring",
    isPinned: true,
    posterName: "Campus Placement Cell",
    date: "2026-07-21",
  },
  {
    id: "anno-contest-2",
    title: "🏆 National Inter-College Coding Championship 2026",
    content: `Participate in the Annual Coding Championship hosted by the Department of Computer Science!\n\n• Cash Prizes: 1st Place ₹50,000 | 2nd Place ₹30,000 | 3rd Place ₹15,000\n• Contest Format: 3 Hours, 6 Algorithmic Problems on HackerRank\n• Date: August 5th, 2026 (04:00 PM - 07:00 PM)`,
    category: "hackathons & contests",
    isPinned: false,
    posterName: "ACM Student Chapter",
    date: "2026-07-20",
  },
  {
    id: "anno-internship-2",
    title: "📊 Data Analyst & Machine Learning Internships (Remote/Hybrid)",
    content: `Apex Analytics is offering 6-month Data Science internships.\n\n• Stipend: ₹30,000 / month\n• Prerequisites: SQL, Python (Pandas, NumPy), PowerBI / Tableau\n• Apply via the Placement Portal.`,
    category: "internships & hiring",
    isPinned: false,
    posterName: "Placement Cell",
    date: "2026-07-18",
  },
  {
    id: "anno-timetable-1",
    title: "📅 End-Semester Examination & Class Timetable Published",
    content: `The official class timetable for Odd Semester 2026 and End-Semester examination schedule for all departments (CSE, ISE, ECE, EEE, ME, CIVIL, AI&DS) has been released.\n\nCheck the Timetable Section to view your room numbers, lecture timings, and exam halls.`,
    category: "exams & timetables",
    isPinned: false,
    posterName: "Controller of Examinations",
    date: "2026-07-15",
  },
];

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = (profile?.role || "student") as "teacher" | "student" | "admin";

  // Fetch announcements
  const { data: dbAnnouncements } = await supabase
    .from("announcements")
    .select(`
      id,
      title,
      content,
      category,
      is_pinned,
      created_at,
      users(full_name, role)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const dbFormatted: AnnouncementItem[] = (dbAnnouncements || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    category: a.category,
    isPinned: a.is_pinned,
    posterName: a.users?.full_name ? `${a.users.full_name} (${a.users.role || 'Faculty'})` : "Campus Administration",
    date: new Date(a.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const allAnnouncements = [...FEATURED_CAMPUS_ANNOUNCEMENTS, ...dbFormatted];

  return (
    <AnnouncementsClient
      initialAnnouncements={allAnnouncements}
      userRole={userRole}
      currentUserId={user.id}
    />
  );
}
