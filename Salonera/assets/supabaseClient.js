// assets/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

// عميل واحد فقط (Singleton) لمنع تعدد GoTrueClient
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// تصديرين لتفادي أي تعارض بين الملفات القديمة والجديدة
export const sb = client;
export const supabase = client;
