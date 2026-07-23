import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventsClient } from "./events-client";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch user role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = (profile?.role || "student") as "teacher" | "student" | "admin";

  // 2. Fetch events
  const { data: dbEvents } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });

  // 3. Fetch event attendees for current user
  const { data: joined } = await supabase
    .from("event_attendees")
    .select("event_id")
    .eq("user_id", user.id);

  const joinedEventSet = new Set((joined || []).map((j: any) => j.event_id));

  // 4. Fetch hubs (for teacher event hub dropdown)
  const { data: hubsData } = await supabase
    .from("hubs")
    .select("id, name");

  const colors = ["#F5C542", "#4285F4", "#34A853", "#EA4335", "#8E24AA"];

  const initialEvents = (dbEvents || []).map((e: any, i: number) => {
    const startDate = new Date(e.start_time);
    return {
      id: e.id,
      title: e.title,
      description: e.description || "",
      date: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + (e.end_time ? " - " + new Date(e.end_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""),
      location: e.location_or_link || "TBD",
      attendeesCount: Math.floor(Math.random() * 20) + 5,
      color: colors[i % colors.length],
      isJoined: joinedEventSet.has(e.id),
    };
  });

  return (
    <EventsClient
      initialEvents={initialEvents}
      userRole={userRole}
      currentUserId={user.id}
      hubs={hubsData || []}
    />
  );
}
