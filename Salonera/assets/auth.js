// assets/auth.js
import { sb } from "./supabaseClient.js";

export async function requireAuth() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    location.href = "login.html";
    return null;
  }
  return user;
}

/**
 * يحدد نوع المستخدم:
 * - staff: لو موجود في profiles ومعه salon_id
 * - customer: لو موجود في customer_profiles
 */
export async function getUserKind() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { kind: "guest" };

  // 1) هل هو موظف/صالون؟
  try {
    const { data: prof } = await sb
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
  } catch { /* ignore */ }

  // 2) هل هو عميل؟
  try {
    const { data: cust } = await sb
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
  } catch { /* ignore */ }

  // fallback
  return {
    kind: "customer",
    user_id: user.id,
    full_name: user.user_metadata?.full_name || "",
  };
}
