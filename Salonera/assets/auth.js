import { supabase } from "./supabaseClient.js";
import { toast } from "./ui.js";

export async function requireAuth({ redirectTo = "login.html" } = {}){
  const sb = supabase();
  const { data } = await sb.auth.getSession();
  if (!data.session){
    location.href = redirectTo;
    return null;
  }
  return data.session;
}

export async function signOut(){
  const sb = supabase();
  await sb.auth.signOut();
  toast("تم تسجيل الخروج");
  setTimeout(()=> location.href = "login.html", 600);
}

export async function getUserKind(){
  const sb = supabase();
  const { data: authData } = await sb.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) return { kind:"guest" };

  const cust = await sb.from("customers").select("user_id,full_name,email,phone").eq("user_id", uid).maybeSingle();
  if (cust.data) return { kind:"customer", ...cust.data };

  const prof = await sb.from("profiles").select("user_id,full_name,phone,salon_id").eq("user_id", uid).maybeSingle();
  if (prof.data) return { kind:"staff", ...prof.data };

  return { kind:"unknown", user_id: uid, full_name: authData.user.user_metadata?.full_name ?? "" };
}

export function isUuid(v){
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}
