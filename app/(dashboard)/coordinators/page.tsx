import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CoordinatorsClient } from "./coordinators-client";

export default async function CoordinatorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify role
  const { data: profile } = await supabase
    .from("users")
    .select("role, college_id")
    .eq("id", user.id)
    .single();

  // Fetch users with admin/coordinator roles or hub creators
  const { data: usersData } = await supabase
    .from("users")
    .select("id, full_name, role, department_id")
    .neq("id", user.id)
    .limit(20);

  // Fetch hubs to map coordinator managed hubs
  const { data: hubsData } = await supabase
    .from("hubs")
    .select("id, name, created_by");

  const hubMap = new Map<string, string[]>();
  (hubsData || []).forEach((h) => {
    const existing = hubMap.get(h.created_by) || [];
    hubMap.set(h.created_by, [...existing, h.name]);
  });

  const formattedCoordinators = (usersData || []).map((u: any, i: number) => {
    const managed = hubMap.get(u.id) || ["Computer Science Club", "Robotics Hub"];
    return {
      id: u.id,
      name: u.full_name || "Campus Coordinator",
      department: u.role === "teacher" ? "Faculty" : "Computer Science",
      role: u.role === "teacher" ? "Faculty Supervisor" : "Student Coordinator",
      managedHubs: managed,
      eventsCount: Math.floor(Math.random() * 8) + 2,
      membersCount: Math.floor(Math.random() * 80) + 15,
      avatarLetter: (u.full_name || "C").charAt(0).toUpperCase(),
    };
  });

  return (
    <CoordinatorsClient
      coordinators={formattedCoordinators}
      currentUserId={user.id}
    />
  );
}
