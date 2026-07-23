"use client";

import { useState } from "react";
import { Users, Search, ShieldCheck, BookOpen, MessageSquare, Award, Activity, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePresenceContext } from "@/components/providers/presence-provider";

export interface CoordinatorItem {
  id: string;
  name: string;
  department: string;
  role: string;
  managedHubs: string[];
  eventsCount: number;
  membersCount: number;
  avatarLetter: string;
}

interface CoordinatorsClientProps {
  coordinators: CoordinatorItem[];
  currentUserId: string;
}

export function CoordinatorsClient({ coordinators, currentUserId }: CoordinatorsClientProps) {
  const { isOnline } = usePresenceContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const departments = Array.from(new Set(coordinators.map((c) => c.department)));

  const filteredCoordinators = coordinators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.managedHubs.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDepartment === "all" || c.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  const onlineCoordinatorsCount = coordinators.filter((c) => isOnline(c.id)).length;
  const totalEvents = coordinators.reduce((acc, c) => acc + c.eventsCount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Coordinator Monitor
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1a1a1a] text-white">
              Teacher Dashboard
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Monitor event coordinators, group leads, and student activity across departments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{onlineCoordinatorsCount} Coordinators Active Now</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8DDD0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Total Coordinators</p>
            <p className="text-2xl font-bold text-[#1a1a1a]">{coordinators.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DDD0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Coordinated Events</p>
            <p className="text-2xl font-bold text-[#1a1a1a]">{totalEvents}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DDD0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Monitored Groups</p>
            <p className="text-2xl font-bold text-[#1a1a1a]">
              {Array.from(new Set(coordinators.flatMap((c) => c.managedHubs))).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E8DDD0]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coordinator or group..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm outline-none bg-gray-50 border border-transparent focus:border-[#F5C542] text-[#1a1a1a] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Department:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] text-gray-800 font-medium cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coordinators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCoordinators.map((coordinator) => {
          const coordinatorOnline = isOnline(coordinator.id);

          return (
            <div
              key={coordinator.id}
              className="p-6 rounded-2xl bg-white border border-[#E8DDD0] hover:border-[#F5C542] transition-all shadow-xs space-y-4 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-[#2D2D2D] text-white font-bold text-lg flex items-center justify-center shadow-xs">
                      {coordinator.avatarLetter}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        coordinatorOnline ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1a1a1a]">{coordinator.name}</h3>
                      {coordinatorOnline ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Active Now
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400">
                          Offline
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 font-semibold">{coordinator.role}</p>
                    <p className="text-[11px] text-gray-400">{coordinator.department}</p>
                  </div>
                </div>

                <Link
                  href="/messages"
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Message Coordinator"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>

              {/* Managed Hubs */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Managed Groups & Communities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {coordinator.managedHubs.map((hub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FAF6F0] border border-[#E8DDD0] text-gray-700"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{coordinator.eventsCount} Events Coordinated</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{coordinator.membersCount} Members Guided</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoordinators.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">No coordinators found</h3>
          <p className="text-xs text-gray-400">Try selecting a different department or search query.</p>
        </div>
      )}
    </div>
  );
}
