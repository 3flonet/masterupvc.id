import { supabase } from "./supabaseClient";

const SESSION_KEY = "masterupvc_admin_session";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "true";
}

export async function verifyAdminEmail(email: string): Promise<boolean> {
  if (!supabase) {
    return email.toLowerCase() === "admin@masterupvc.id";
  }
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email.toLowerCase());

    if (error || !data || data.length === 0) {
      return email.toLowerCase() === "admin@masterupvc.id"; // Fallback to default mock admin
    }
    return true;
  } catch {
    return email.toLowerCase() === "admin@masterupvc.id"; // Fallback to default mock admin
  }
}

export function loginAdmin(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, "true");
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
