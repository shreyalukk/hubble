import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface OnlineUser {
  id: string;
  name: string;
  avatar_url?: string | null;
  online_at: string;
}

export function usePresence(
  currentUser: { id: string; name: string; avatar_url?: string | null } | null
) {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const supabase = createClient();

  useEffect(() => {
    if (!currentUser) return;

    let channel: RealtimeChannel;

    const setupPresence = async () => {
      channel = supabase.channel("global_presence", {
        config: {
          presence: {
            key: currentUser.id,
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          const newOnlineUsers = new Map<string, OnlineUser>();
          
          Object.keys(state).forEach((key) => {
            const presenceInfo = state[key][0] as any;
            if (presenceInfo) {
              newOnlineUsers.set(key, {
                id: presenceInfo.id,
                name: presenceInfo.name,
                avatar_url: presenceInfo.avatar_url,
                online_at: presenceInfo.online_at,
              });
            }
          });
          
          setOnlineUsers(newOnlineUsers);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              id: currentUser.id,
              name: currentUser.name,
              avatar_url: currentUser.avatar_url,
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser, supabase]);

  return {
    onlineUsers: Array.from(onlineUsers.values()),
    isOnline: (userId: string) => onlineUsers.has(userId),
  };
}
