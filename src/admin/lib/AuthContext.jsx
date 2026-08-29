import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "./supabaseClient";

const AuthContext = createContext(null);

const ERROR_TEXT = {
  bad_credentials: "邮箱或密码错误",
  disabled: "账号已禁用",
  no_permission: "没有权限",
};

async function resolveProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return { profile: null, errorCode: "no_permission" };
  if (data.status !== "active") return { profile: null, errorCode: "disabled" };
  if (data.role !== "admin" && data.role !== "agent") return { profile: null, errorCode: "no_permission" };
  return { profile: data, errorCode: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authErrorCode, setAuthErrorCode] = useState(null);

  const applySession = useCallback(async (nextSession) => {
    setSession(nextSession ?? null);
    if (!nextSession?.user?.id) {
      setProfile(null);
      setAuthErrorCode(null);
      return;
    }
    const { profile: p, errorCode } = await resolveProfile(nextSession.user.id);
    setProfile(p);
    setAuthErrorCode(errorCode);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await applySession(data.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      await applySession(newSession);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [applySession]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { errorText: ERROR_TEXT.bad_credentials, role: null };
    }
    const { profile: p, errorCode } = await resolveProfile(data.user.id);
    if (!p) {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setAuthErrorCode(null);
      return { errorText: ERROR_TEXT[errorCode] || ERROR_TEXT.no_permission, role: null };
    }
    setSession(data.session);
    setProfile(p);
    setAuthErrorCode(null);
    return { errorText: null, role: p.role };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setAuthErrorCode(null);
  };

  const value = {
    session, profile, role: profile?.role ?? null,
    isAdmin: profile?.role === "admin", isAgent: profile?.role === "agent",
    loading, authErrorText: authErrorCode ? ERROR_TEXT[authErrorCode] : null,
    signIn, signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return ctx;
}
