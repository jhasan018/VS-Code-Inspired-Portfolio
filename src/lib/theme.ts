import { cache } from "react";
import { createAnonClient } from "@/lib/supabase/server";

export type FrontendTheme = "vscode" | "dimension" | "lume" | "solace";

export const FRONTEND_THEMES: FrontendTheme[] = ["vscode", "dimension", "lume", "solace"];

export const getActiveTheme = cache(async (): Promise<FrontendTheme> => {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "frontend_theme")
    .maybeSingle();

  return data?.value === "dimension"
    ? "dimension"
    : data?.value === "lume"
      ? "lume"
      : data?.value === "solace"
        ? "solace"
        : "vscode";
});