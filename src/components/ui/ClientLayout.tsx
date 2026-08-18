"use client";
import type { FrontendTheme } from "@/lib/theme";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
  frontendTheme: FrontendTheme;
}) {
  return <>{children}</>;
}
