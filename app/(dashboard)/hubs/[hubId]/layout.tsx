"use client";

import Link from "next/link";
import { Hash, Settings, Users, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const channels = [
  { id: "general", name: "general", type: "text" },
  { id: "announcements", name: "announcements", type: "announcement" },
  { id: "resources", name: "resources", type: "resources" },
  { id: "voice-lounge", name: "Voice Lounge", type: "voice" },
];

const members = [
  { id: 1, name: "Alice Johnson", role: "admin", status: "online" },
  { id: 2, name: "Bob Smith", role: "member", status: "offline" },
  { id: 3, name: "Charlie Davis", role: "member", status: "online" },
];

export default function HubLayout({ children, params }: { children: React.ReactNode, params: { hubId: string } }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full border border-white/10 rounded-xl overflow-hidden bg-background">
      {/* Channels Sidebar */}
      <div className="w-64 border-r border-white/10 bg-zinc-950/50 flex flex-col hidden md:flex">
        <div className="h-14 flex items-center px-4 border-b border-white/10 shrink-0">
          <h2 className="font-bold font-heading truncate flex-1">CS 101 Study Group</h2>
          <button className="text-muted-foreground hover:text-foreground">
            <Settings className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Channels
          </div>
          {channels.map((ch) => {
            const isActive = pathname.includes(`/channels/${ch.id}`);
            return (
              <Link 
                key={ch.id} 
                href={`/hubs/${params.hubId}/channels/${ch.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {ch.type === "voice" ? <Phone className="size-4" /> : <Hash className="size-4" />}
                {ch.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {children}
      </div>

      {/* Members Sidebar */}
      <div className="w-64 border-l border-white/10 bg-zinc-950/50 hidden lg:flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-white/10 shrink-0">
          <Users className="size-4 mr-2 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Members (120)</h3>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-4">
          <div>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Admin - 1</div>
             {members.filter(m => m.role === "admin").map(m => (
               <div key={m.id} className="flex items-center gap-2 py-1">
                 <div className="relative">
                   <div className="size-6 rounded-full bg-primary/20" />
                   <div className={cn("absolute bottom-0 right-0 size-2 rounded-full border-2 border-zinc-950", m.status === "online" ? "bg-green-500" : "bg-muted")} />
                 </div>
                 <span className="text-sm">{m.name}</span>
               </div>
             ))}
          </div>
          <div>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Online - 24</div>
             {members.filter(m => m.role === "member" && m.status === "online").map(m => (
               <div key={m.id} className="flex items-center gap-2 py-1">
                 <div className="relative">
                   <div className="size-6 rounded-full bg-blue-500/20" />
                   <div className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-zinc-950 bg-green-500" />
                 </div>
                 <span className="text-sm text-muted-foreground">{m.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
