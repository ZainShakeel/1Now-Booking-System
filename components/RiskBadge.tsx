import type { RiskLevel } from "@/lib/types";

// Risk level shown as a badge. The level is always conveyed with TEXT
// (and a shape/icon), never color alone — so it is readable for anyone
// who cannot distinguish the colors.
const styles: Record<RiskLevel, { classes: string; symbol: string }> = {
  Low: {
    classes: "bg-green-100 text-green-800 border-green-300",
    symbol: "●",
  },
  Medium: {
    classes: "bg-amber-100 text-amber-900 border-amber-300",
    symbol: "◆",
  },
  High: {
    classes: "bg-red-100 text-red-800 border-red-300",
    symbol: "▲",
  },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { classes, symbol } = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes}`}
    >
      <span aria-hidden="true">{symbol}</span>
      <span>{level} risk</span>
    </span>
  );
}
