import VSCodeLayout from "@/components/vscode/VSCodeLayout";
import DimensionShell from "@/themes/dimension/DimensionShell";
import { getActiveTheme } from "@/lib/theme";

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();
  return theme === "dimension" ? <DimensionShell>{children}</DimensionShell> : <VSCodeLayout>{children}</VSCodeLayout>;
}
