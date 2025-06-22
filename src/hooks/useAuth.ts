"use client";

import { useEffect, useState } from "react";

interface User {
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem("serene.user.email");
    const name = localStorage.getItem("serene.user.name");
    const access = localStorage.getItem("supabase.access_token");
    const refresh = localStorage.getItem("supabase.refresh_token");
    const id = localStorage.getItem("serene.user.id")
    

    if (email) {
      setUser({ email, name: name || undefined });
    }
    if (access) {
      setAccessToken(access);
    }
    if (refresh) {
      setRefreshToken(refresh);
    }

    if (id) {
        setUserId(id)
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("supabase.access_token");
    localStorage.removeItem("supabase.refresh_token");
    localStorage.removeItem("serene.user.email");
    localStorage.removeItem("serene.user.name");
    localStorage.removeItem("serene.user.id");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null)
  };
  
   return { user, userId, accessToken, refreshToken, logout };
}