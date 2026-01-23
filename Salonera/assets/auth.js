// assets/auth.js
import { supabase } from "./supabaseClient.js";

export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    location.href = "login.html";
    return null;
  }
  return user;
}

export async function getUserKind() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { kind: "guest" };

  // staff?
  try {
    const { data: prof } = await supabase
      .from("profiles")
      .select("user_id, full_name, salon_id")
      .eq("user_id", user.id)
      .single();

    if (prof?.salon_id) {
      return {
        kind: "staff",
        user_id: user.id,
        full_name: prof.full_name || user.user_metadata?.full_name || "",
        salon_id: prof.salon_id,
      };
    }
  } catch {}

  // customer?
  try {
    const { data: cust } = await supabase
      .from("customer_profiles")
      .select("user_id, full_name")
      .eq("user_id", user.id)
      .single();

    if (cust?.user_id) {
      return {
        kind: "customer",
        user_id: user.id,
        full_name: cust.full_name || user.user_metadata?.full_name || "",
      };
    }
  } catch {}

  return {
    kind: "customer",
    user_id: user.id,
    full_name: user.user_metadata?.full_name || "",
  };
}
