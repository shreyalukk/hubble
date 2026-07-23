import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssignmentsClient } from "./assignments-client";

export default async function AssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. User profile and role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = (profile?.role || "student") as "teacher" | "student" | "admin";

  // 2. Fetch assignments
  const { data: assignmentsData } = await supabase
    .from("assignments")
    .select(`
      id,
      title,
      description,
      deadline,
      points,
      hub_id,
      hubs(name)
    `)
    .order("deadline", { ascending: true });

  // 3. Fetch submissions for student
  const { data: submissionsData } = await supabase
    .from("submissions")
    .select("assignment_id, graded_points, feedback")
    .eq("student_id", user.id);

  const submissionMap = new Map();
  (submissionsData || []).forEach((s) => {
    submissionMap.set(s.assignment_id, s);
  });

  // 4. Fetch user's hubs
  const { data: hubsData } = await supabase.from("hubs").select("id, name");

  const formattedAssignments = (assignmentsData || []).map((a: any) => {
    const sub = submissionMap.get(a.id);
    const deadlineDate = a.deadline ? new Date(a.deadline) : new Date();

    return {
      id: a.id,
      title: a.title,
      description: a.description || "",
      deadline: deadlineDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      points: a.points || 100,
      hubName: a.hubs?.name || "General Group",
      hubId: a.hub_id,
      submitted: !!sub,
      grade: sub?.graded_points ?? null,
      feedback: sub?.feedback ?? null,
    };
  });

  return (
    <AssignmentsClient
      initialAssignments={formattedAssignments}
      userRole={userRole}
      currentUserId={user.id}
      hubs={hubsData || []}
    />
  );
}
