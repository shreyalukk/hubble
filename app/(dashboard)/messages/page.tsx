import { MessageSquare, Search } from "lucide-react";

const conversations = [
  { id: 1, name: "Alice Johnson", lastMessage: "Hey! Are you coming to the meetup?", time: "2m ago", unread: 2 },
  { id: 2, name: "Bob Smith", lastMessage: "Sure, I'll send the notes.", time: "15m ago", unread: 0 },
  { id: 3, name: "Charlie Davis", lastMessage: "The project deadline is tomorrow.", time: "1h ago", unread: 1 },
  { id: 4, name: "Diana Wilson", lastMessage: "Thanks for the help!", time: "3h ago", unread: 0 },
];

export default function DirectMessagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6" style={{ color: "#1a1a1a" }}>
        Messages
      </h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full h-11 pl-11 pr-4 rounded-xl text-sm outline-none transition-all"
          style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #E8DDD0", color: "#1a1a1a" }}
        />
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: "#F5C542" }}
            >
              {convo.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold truncate" style={{ color: "#1a1a1a" }}>{convo.name}</span>
                <span className="text-xs shrink-0 ml-2" style={{ color: "#9CA3AF" }}>{convo.time}</span>
              </div>
              <p className="text-xs truncate" style={{ color: "#6b7280" }}>{convo.lastMessage}</p>
            </div>
            {convo.unread > 0 && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: "#F5C542" }}
              >
                {convo.unread}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state if no convos */}
      {conversations.length === 0 && (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: "#E8DDD0" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>No messages yet</h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Select a friend to start chatting.</p>
        </div>
      )}
    </div>
  );
}
