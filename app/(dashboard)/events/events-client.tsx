"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, Users, Plus, Check, X, BookOpen, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  color: string;
  isJoined?: boolean;
}

interface EventsClientProps {
  initialEvents: EventItem[];
  userRole: "teacher" | "student" | "admin";
  currentUserId: string;
  hubs: { id: string; name: string }[];
}

export function EventsClient({
  initialEvents,
  userRole,
  currentUserId,
  hubs,
}: EventsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [joinedEventIds, setJoinedEventIds] = useState<Set<string>>(
    new Set(initialEvents.filter((e) => e.isJoined).map((e) => e.id))
  );

  // Modal State for Teachers creating events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hubId, setHubId] = useState(hubs[0]?.id || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const isTeacher = userRole === "teacher" || userRole === "admin";

  const handleToggleJoin = async (eventId: string) => {
    const isJoined = joinedEventIds.has(eventId);
    const newJoined = new Set(joinedEventIds);

    if (isJoined) {
      newJoined.delete(eventId);
      setJoinedEventIds(newJoined);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, attendeesCount: Math.max(0, e.attendeesCount - 1) } : e
        )
      );

      await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", currentUserId);
    } else {
      newJoined.add(eventId);
      setJoinedEventIds(newJoined);

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, attendeesCount: e.attendeesCount + 1 } : e))
      );

      await supabase.from("event_attendees").insert({
        event_id: eventId,
        user_id: currentUserId,
      });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !hubId) return;

    setIsCreating(true);

    try {
      const { data: newEvent, error } = await supabase
        .from("events")
        .insert({
          title,
          description,
          hub_id: hubId,
          start_time: new Date(startTime).toISOString(),
          end_time: endTime ? new Date(endTime).toISOString() : null,
          location_or_link: location,
          created_by: currentUserId,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to create event: ${error.message}`);
        setIsCreating(false);
        return;
      }

      if (newEvent) {
        const startDate = new Date(newEvent.start_time);
        const formattedEvent: EventItem = {
          id: newEvent.id,
          title: newEvent.title,
          description: newEvent.description || "",
          date: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          location: newEvent.location_or_link || "Campus Main Hall",
          attendeesCount: 1,
          color: "#F5C542",
          isJoined: true,
        };

        // Auto-join creator
        await supabase.from("event_attendees").insert({
          event_id: newEvent.id,
          user_id: currentUserId,
        });

        setEvents((prev) => [formattedEvent, ...prev]);
        setJoinedEventIds((prev) => new Set([...prev, newEvent.id]));
        setIsModalOpen(false);

        // Reset form
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setLocation("");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Events</h1>
            {isTeacher && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Teacher Creator
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {isTeacher
              ? "Create and manage events for your students and campus communities"
              : "Discover & join upcoming workshops, seminars, and club events"}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#F5C542]" />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => {
          const isJoined = joinedEventIds.has(event.id);

          return (
            <div
              key={event.id}
              className="rounded-2xl p-6 flex flex-col sm:flex-row gap-5 transition-all duration-200 hover:shadow-md bg-white border border-[#E8DDD0]"
            >
              {/* Date Badge */}
              <div
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{ backgroundColor: `${event.color}15` }}
              >
                <span className="text-[10px] font-bold uppercase" style={{ color: event.color }}>
                  {event.date.split(" ")[0] || "EVT"}
                </span>
                <span className="text-lg font-bold leading-none" style={{ color: event.color }}>
                  {event.date.split(" ")[1]?.replace(",", "") || "1"}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold mb-1 text-[#1a1a1a]">{event.title}</h3>
                <p className="text-xs mb-3 text-gray-600 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-4 flex-wrap text-gray-500">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {event.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> {event.attendeesCount} attending
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggleJoin(event.id)}
                className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isJoined
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-[#2D2D2D] text-white hover:bg-gray-800"
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Attending</span>
                  </>
                ) : (
                  <span>Join Event</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold mb-2 text-[#1a1a1a]">No events scheduled yet</h2>
          <p className="text-sm text-gray-400 mb-4">
            {isTeacher
              ? "You can create the first event for your department or group!"
              : "Events created by your teachers and groups will appear here."}
          </p>
          {isTeacher && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5C542] text-white text-xs font-semibold rounded-xl hover:bg-[#e5b532] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      )}

      {/* Teacher Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Create New Event</h3>
                <p className="text-xs text-gray-500">Teacher Event Publishing</p>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Event Title <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Ethics Seminar & Workshop"
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              {hubs.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Group / Hub <span className="text-[#F5C542]">*</span>
                  </label>
                  <select
                    value={hubId}
                    onChange={(e) => setHubId(e.target.value)}
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
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will take place during this event?"
                  rows={3}
                  className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Start Date & Time <span className="text-[#F5C542]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Location or Online Link
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Auditorium B or https://meet.google.com/..."
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !title || !startTime}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>{isCreating ? "Publishing..." : "Publish Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
