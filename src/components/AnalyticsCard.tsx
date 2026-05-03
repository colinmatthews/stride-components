import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type AnalyticsDeltaDirection = "up" | "down" | "flat";

export interface AnalyticsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Secondary line, e.g. comparison window */
  caption?: string;
  delta?: {
    label: string;
    direction?: AnalyticsDeltaDirection;
  };
  emphasis?: boolean;
}

export function AnalyticsCard({
  label,
  value,
  unit,
  caption,
  delta,
  emphasis,
  className,
  ...props
}: AnalyticsCardProps) {
  const DeltaIcon =
    delta?.direction === "down"
      ? TrendingDown
      : delta?.direction === "up"
        ? TrendingUp
        : Minus;

  const deltaTone =
    delta?.direction === "up"
      ? "text-pr"
      : delta?.direction === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-xl border border-border bg-surface p-4",
        className,
      )}
      {...props}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "stat-num mt-0.5 text-2xl leading-none tracking-tight",
          emphasis ? "text-primary" : "text-foreground",
        )}
      >
        {value}
        {unit ? (
          <span className="ml-1 font-body text-sm font-normal text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      {(caption ?? delta) ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {caption ? <span className="font-body text-xs text-muted-foreground">{caption}</span> : null}
          {delta ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                deltaTone,
              )}
            >
              <DeltaIcon className="h-3 w-3 shrink-0" aria-hidden />
              {delta.label}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
