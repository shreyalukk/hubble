"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePresence, OnlineUser } from "@/hooks/use-presence";
import { createClient } from "@/lib/supabase/client";

interface PresenceContextType {
  onlineUsers: OnlineUser[];
  isOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
  isOnline: () => false,
});

export const usePresenceContext = () => useContext(PresenceContext);

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar_url?: string | null } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        
        setCurrentUser({
          id: user.id,
          name: profile?.full_name || "User",
          avatar_url: profile?.avatar_url,
        });
      }
    };
    fetchUser();
  }, [supabase]);

  const { onlineUsers, isOnline } = usePresence(currentUser);

  return (
    <PresenceContext.Provider value={{ onlineUsers, isOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}
