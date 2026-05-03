import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  series?: number[];
  icon?: LucideIcon;
  invertDelta?: boolean;
}

export function AnalyticsCard({
  label,
  value,
  unit,
  delta,
  deltaLabel = "vs last week",
  series,
  icon: Icon,
  invertDelta,
}: Props) {
  const direction = delta === undefined ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const positive = invertDelta ? direction === "down" : direction === "up";
  const negative = invertDelta ? direction === "up" : direction === "down";
  const deltaColor = positive
    ? "text-pr"
    : negative
      ? "text-destructive"
      : "text-muted-foreground";
  const DeltaIcon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;

  return (
    <article className="border border-border bg-surface px-5 py-4 transition-colors hover:border-foreground/30">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{label}</span>
        </div>
        {delta !== undefined && (
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] ${deltaColor}`}>
            <DeltaIcon className="h-3 w-3" />
            <span className="num font-semibold">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          </span>
        )}
      </header>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="stat-num text-3xl font-bold leading-none tracking-tight">
          {value}
          {unit && (
            <span className="ml-1 font-body text-sm font-normal text-muted-foreground">{unit}</span>
          )}
        </div>
        {series && series.length > 1 && <Sparkline data={series} positive={positive} negative={negative} />}
      </div>

      {delta !== undefined && (
        <div className="mt-2 text-[11px] text-muted-foreground">{deltaLabel}</div>
      )}
    </article>
  );
}

function Sparkline({
  data,
  positive,
  negative,
}: {
  data: number[];
  positive: boolean;
  negative: boolean;
}) {
  const w = 88;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const stroke = positive
    ? "var(--color-pr, #46c272)"
    : negative
      ? "var(--color-destructive, #d64032)"
      : "var(--color-primary, #f06f24)";

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
