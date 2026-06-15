import Link from "next/link";
import { MoreVertical, Users, Lock, Globe } from "lucide-react";

export interface GroupCardProps {
  type: "PUBLIC GROUP" | "PRIVATE GROUP";
  title: string;
  activeText: string;
  membersCount: number;
  illustrationId?: number;
}

const cardColors = [
  "#F5C542", "#4285F4", "#34A853", "#EA4335", "#FBBC05",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
];

export function GroupCard({ type, title, activeText, membersCount, illustrationId = 1 }: GroupCardProps) {
  const isPublic = type === "PUBLIC GROUP";
  const accentColor = cardColors[(illustrationId - 1) % cardColors.length];

  return (
    <Link href={`/hubs/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/channels/general`}>
      <div
        className="rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3"
              style={{
                backgroundColor: isPublic ? "#FFF9E6" : "#F0FDF4",
                color: isPublic ? "#D4A017" : "#16A34A",
              }}
            >
              {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {type}
            </span>
            <h3 className="text-lg font-bold tracking-tight leading-tight mb-1.5" style={{ color: "#1a1a1a" }}>
              {title}
            </h3>
            <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
              {activeText} • {membersCount} Members
            </p>
          </div>

          <button
            className="p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{ color: "#9CA3AF" }}
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Illustration Area */}
        <div className="mt-auto pt-4">
          <div
            className="rounded-xl w-full aspect-[4/3] flex items-center justify-center overflow-hidden relative"
            style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}20` }}
          >
            {/* Abstract illustration */}
            <svg viewBox="0 0 200 150" fill="none" className="w-full h-full p-4 opacity-60">
              <circle cx="100" cy="60" r="25" fill={accentColor} opacity="0.2" />
              <circle cx="70" cy="90" r="15" fill={accentColor} opacity="0.15" />
              <circle cx="135" cy="85" r="18" fill={accentColor} opacity="0.15" />
              <rect x="60" y="110" width="80" height="6" rx="3" fill={accentColor} opacity="0.12" />
              <rect x="75" y="122" width="50" height="4" rx="2" fill={accentColor} opacity="0.08" />
            </svg>

            {/* Floating member count */}
            <div
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#FFFFFF", color: "#374151", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <Users className="w-3 h-3" style={{ color: accentColor }} />
              {membersCount}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
