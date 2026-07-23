"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Lock, Globe, KeyRound, Copy, Check, ArrowRight } from "lucide-react";

export interface GroupCardProps {
  id: string;
  type: "PUBLIC GROUP" | "PRIVATE GROUP";
  title: string;
  description?: string;
  passcode?: string | null;
  activeText: string;
  membersCount: number;
  isJoined?: boolean;
  illustrationId?: number;
  onJoinClick?: (hubId: string, isPrivate: boolean) => void;
}

const cardColors = [
  "#F5C542", "#4285F4", "#34A853", "#EA4335", "#FBBC05",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
];

export function GroupCard({
  id,
  type,
  title,
  description,
  passcode,
  activeText,
  membersCount,
  isJoined = false,
  illustrationId = 1,
  onJoinClick,
}: GroupCardProps) {
  const isPublic = type === "PUBLIC GROUP";
  const accentColor = cardColors[(illustrationId - 1) % cardColors.length];
  const [copied, setCopied] = useState(false);

  const hubSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const targetHref = `/hubs/${id}/channels/general`;

  const handleCopyPasscode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!passcode) return;
    navigator.clipboard.writeText(passcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardAction = (e: React.MouseEvent) => {
    if (!isJoined && onJoinClick) {
      e.preventDefault();
      onJoinClick(id, !isPublic);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-[#E8DDD0] relative group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider"
              style={{
                backgroundColor: isPublic ? "#FFF9E6" : "#EBF5FF",
                color: isPublic ? "#D4A017" : "#2563EB",
              }}
            >
              {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {type}
            </span>

            {isJoined && (
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700">
                Joined Member
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-tight leading-tight mb-1.5 text-[#1a1a1a]">
            {title}
          </h3>
          <p className="text-xs font-medium text-gray-400">
            {activeText} • {membersCount} Members
          </p>
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Passcode display for members of private groups */}
      {!isPublic && passcode && isJoined && (
        <div className="mb-4 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-blue-900">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">Code:</span>
            <code className="font-mono font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200 text-xs">
              {passcode}
            </code>
          </div>
          <button
            onClick={handleCopyPasscode}
            type="button"
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Copy Group Passcode"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Illustration Area */}
      <div className="mt-auto pt-2 mb-4">
        <div
          className="rounded-xl w-full aspect-[16/9] flex items-center justify-center overflow-hidden relative"
          style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}20` }}
        >
          <svg viewBox="0 0 200 150" fill="none" className="w-full h-full p-4 opacity-60">
            <circle cx="100" cy="60" r="25" fill={accentColor} opacity="0.2" />
            <circle cx="70" cy="90" r="15" fill={accentColor} opacity="0.15" />
            <circle cx="135" cy="85" r="18" fill={accentColor} opacity="0.15" />
            <rect x="60" y="110" width="80" height="6" rx="3" fill={accentColor} opacity="0.12" />
          </svg>

          <div
            className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-gray-700 shadow-xs"
          >
            <Users className="w-3 h-3" style={{ color: accentColor }} />
            {membersCount}
          </div>
        </div>
      </div>

      {/* Join / Open Action Button */}
      <div>
        {isJoined ? (
          <Link
            href={targetHref}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Group</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : isPublic ? (
          <button
            onClick={handleCardAction}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2D2D2D] hover:bg-gray-800 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Join Public Group</span>
          </button>
        ) : (
          <button
            onClick={handleCardAction}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Enter Passcode to Join</span>
          </button>
        )}
      </div>
    </div>
  );
}
