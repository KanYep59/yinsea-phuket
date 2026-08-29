import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("your-project") &&
    !SUPABASE_ANON_KEY.includes("your-anon-key")
);

// 主客户端：后台管理系统登录会话使用这个实例。
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  {
    auth: {
      storageKey: "yinsea-admin-auth",
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// 独立客户端：仅用于"管理员为代理商创建登录账号"这类操作。
// 使用单独的 storageKey，避免创建新账号时覆盖管理员当前的登录会话。
export function createEphemeralClient() {
  return createClient(
    SUPABASE_URL || "https://placeholder.supabase.co",
    SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      auth: {
        storageKey: "yinsea-admin-ephemeral-" + Date.now(),
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
