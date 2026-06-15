import Link from "next/link";
import { Users, MessageSquare, Calendar, Plus, ArrowRight, TrendingUp, BookOpen } from "lucide-react";

const quickActions = [
  { icon: Users, label: "Browse Groups", href: "/groups", color: "#F5C542" },
  { icon: MessageSquare, label: "Messages", href: "/messages", color: "#4285F4" },
  { icon: Calendar, label: "Events", href: "/events", color: "#34A853" },
  { icon: Plus, label: "Create Hub", href: "/hubs/new", color: "#EA4335" },
];

const stats = [
  { label: "Communities Joined", value: "3", icon: Users },
  { label: "Messages Sent", value: "24", icon: MessageSquare },
  { label: "Events This Week", value: "2", icon: Calendar },
];

const recentGroups = [
  { name: "Computer Science 101", members: 142, type: "PUBLIC" },
  { name: "Photography Club", members: 58, type: "PUBLIC" },
  { name: "Startup Founders", members: 34, type: "PRIVATE" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: "#1a1a1a" }}>
            Welcome to Hubble 👋
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Here&apos;s a quick overview of your college communities.
          </p>
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#2D2D2D" }}
          >
            Explore Groups
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Decorative blob */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{ backgroundColor: "#F5C542", opacity: 0.1 }}
        />
        <div
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full"
          style={{ backgroundColor: "#E8DDD0", opacity: 0.3 }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FFF9E6" }}
              >
                <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>{stat.value}</div>
                <div className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1a1a1a" }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-md group"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#374151" }}>
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>Your Groups</h2>
          <Link href="/groups" className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: "#D4A017" }}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentGroups.map((group) => (
            <Link
              key={group.name}
              href="/groups"
              className="flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:shadow-md group"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: "#FFF9E6", color: "#D4A017" }}
                >
                  {group.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{group.name}</div>
                  <div className="text-xs" style={{ color: "#9CA3AF" }}>
                    {group.members} members • {group.type}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#9CA3AF" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 text-xs text-center" style={{ color: "#9CA3AF", borderTop: "1px solid #E8DDD0" }}>
        Hubble © 2025. All rights reserved.
      </div>
    </div>
  );
}
