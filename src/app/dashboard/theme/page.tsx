import { getActiveTheme } from "@/lib/theme";
import ThemeSettings from "./theme-settings";

export default async function ThemePage() {
  return <ThemeSettings initialTheme={await getActiveTheme()} />;
}
