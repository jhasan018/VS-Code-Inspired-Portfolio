import VSCodeLayout from "@/components/vscode/VSCodeLayout";
import DimensionShell from "@/themes/dimension/DimensionShell";
import LumeShell from "@/themes/lume/LumeShell";
import SolaceShell from "@/themes/solace/SolaceShell";
import { getActiveTheme } from "@/lib/theme";

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();
  if (theme === "dimension") return <DimensionShell>{children}</DimensionShell>;
  if (theme === "lume") return <LumeShell>{children}</LumeShell>;
  if (theme === "solace") return <SolaceShell>{children}</SolaceShell>;
  return <VSCodeLayout>{children}</VSCodeLayout>;
}
