import VSCodeLayout from "@/components/vscode/VSCodeLayout";
import DimensionShell from "@/themes/dimension/DimensionShell";
import LumeShell from "@/themes/lume/LumeShell";
import { getActiveTheme } from "@/lib/theme";

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();
  if (theme === "dimension") return <DimensionShell>{children}</DimensionShell>;
  if (theme === "lume") return <LumeShell>{children}</LumeShell>;
  return <VSCodeLayout>{children}</VSCodeLayout>;
}
