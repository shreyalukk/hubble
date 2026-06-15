import { Calendar, MapPin, Clock, Users } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "AI/ML Workshop",
    description: "Introduction to Machine Learning with Python",
    date: "Jun 18, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Room 301, CS Building",
    attendees: 45,
    color: "#F5C542",
  },
  {
    id: 2,
    title: "Photography Walk",
    description: "Explore campus and practice portrait photography",
    date: "Jun 20, 2025",
    time: "5:00 PM - 7:00 PM",
    location: "Main Gate Entrance",
    attendees: 23,
    color: "#4285F4",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    description: "Present your startup ideas to a panel of judges",
    date: "Jun 22, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Auditorium, Block A",
    attendees: 120,
    color: "#34A853",
  },
];

export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
        Events
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
        Upcoming events from your college communities
      </p>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl p-6 flex gap-5 transition-all duration-200 hover:shadow-md cursor-pointer"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
          >
            {/* Date Badge */}
            <div
              className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0"
              style={{ backgroundColor: `${event.color}15` }}
            >
              <span className="text-[10px] font-bold uppercase" style={{ color: event.color }}>
                {event.date.split(" ")[0]}
              </span>
              <span className="text-lg font-bold leading-none" style={{ color: event.color }}>
                {event.date.split(" ")[1].replace(",", "")}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold mb-1" style={{ color: "#1a1a1a" }}>{event.title}</h3>
              <p className="text-xs mb-3" style={{ color: "#6b7280" }}>{event.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                  <Clock className="w-3.5 h-3.5" /> {event.time}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                  <MapPin className="w-3.5 h-3.5" /> {event.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                  <Users className="w-3.5 h-3.5" /> {event.attendees} attending
                </span>
              </div>
            </div>

            <button
              className="self-center px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0 transition-all hover:opacity-90"
              style={{ backgroundColor: "#2D2D2D" }}
            >
              Join
            </button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {upcomingEvents.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "#E8DDD0" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>No events yet</h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Events from your groups will show up here.</p>
        </div>
      )}
    </div>
  );
}
