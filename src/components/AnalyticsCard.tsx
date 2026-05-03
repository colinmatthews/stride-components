import type { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: Trend;
  delta?: string;
  deltaLabel?: string;
  data?: number[];
  className?: string;
}

export function AnalyticsCard({
  label,
  value,
  unit,
  icon,
  trend = "flat",
  delta,
  deltaLabel,
  data,
  className,
}: Props) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : ArrowRight;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </div>
          <div className="stat-num mt-1 flex items-baseline gap-1 text-2xl leading-none text-foreground">
            <span>{value}</span>
            {unit && (
              <span className="font-body text-sm font-normal text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-2 text-primary">
            {icon}
          </div>
        )}
      </div>

      {(delta || data?.length) && (
        <div className="mt-4 flex min-h-8 items-end justify-between gap-3">
          {delta ? (
            <div
              className={cn(
                "inline-flex min-w-0 items-center gap-1 text-xs",
                trend === "down"
                  ? "text-destructive"
                  : trend === "up"
                    ? "text-pr"
                    : "text-muted-foreground",
              )}
            >
              <TrendIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono font-medium">{delta}</span>
              {deltaLabel && <span className="truncate text-muted-foreground">{deltaLabel}</span>}
            </div>
          ) : (
            <span />
          )}
          {data?.length ? <Sparkline data={data} trend={trend} /> : null}
        </div>
      )}
    </section>
  );
}

function Sparkline({ data, trend }: { data: number[]; trend: Trend }) {
  const points = toSparklinePoints(data);
  const stroke =
    trend === "down" ? "var(--destructive)" : trend === "up" ? "var(--pr)" : "var(--primary)";

  return (
    <svg
      viewBox="0 0 96 32"
      className="h-8 w-24 shrink-0"
      role="img"
      aria-label="Recent trend"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function toSparklinePoints(data: number[]) {
  if (data.length === 1) return "0,16 96,16";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 96;
      const y = 28 - ((value - min) / range) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
