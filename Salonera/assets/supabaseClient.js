import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

function getStorage(){
  const remember = localStorage.getItem("pv_remember") !== "0";
  return remember ? localStorage : sessionStorage;
}

export function supabase(){
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storage: getStorage(),
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
