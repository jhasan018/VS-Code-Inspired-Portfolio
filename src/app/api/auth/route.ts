import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.DASHBOARD_EMAIL ?? "admin@portfolio.com";
const ADMIN_PASSWORD = process.env.DASHBOARD_PASSWORD ?? "admin123";
const SESSION_COOKIE = "dashboard_session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
