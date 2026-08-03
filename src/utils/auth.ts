// Auth utility - uses localStorage for session management
// Admin authentication is handled by /api/auth/login (MySQL-based)

const SESSION_KEY = "masterupvc_admin_session";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "true";
}

export async function verifyAdminEmail(email: string): Promise<boolean> {
  // Verification is handled by the API endpoint /api/auth/login
  // This is a client-side fallback check
  return email.toLowerCase().includes("@");
}

export function loginAdmin(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, "true");
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
