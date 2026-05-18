import { useMemo, useState } from "react";
import {
  ATHLETES,
  SEGMENTS,
  fmtDuration,
  ME,
} from "@/lib/mock-data";
import { AppShell } from "@/components/AppShell";
import { RouteMap } from "@/components/RouteMap";
import { SportBadge } from "@/components/SportBadge";
import { Stat } from "@/components/Stat";
import { Trophy, Star, Heart, ChevronRight, Activity as ActivityIcon } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Zone = { name: string; min: number; max: number; color: string; label: string };
const HR_ZONES: Zone[] = [
  { name: "Z1", min: 0, max: 130, color: "oklch(0.78 0.10 145)", label: "Recovery" },
  { name: "Z2", min: 130, max: 148, color: "oklch(0.78 0.13 110)", label: "Endurance" },
  { name: "Z3", min: 148, max: 162, color: "oklch(0.78 0.15 80)", label: "Tempo" },
  { name: "Z4", min: 162, max: 176, color: "oklch(0.75 0.17 50)", label: "Threshold" },
  { name: "Z5", min: 176, max: 220, color: "oklch(0.65 0.20 25)", label: "VO₂" },
];

// HR samples synthesized deterministically from segment routeSeed
function hrSamples(seed: number, durationSec: number) {
  const points = 60;
  let hr = 140;
  const out: { t: number; tLabel: string; hr: number; pace: number; cad: number; elev: number }[] = [];
  let current = seed;
  const next = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
  for (let i = 0; i < points; i++) {
    const phase = i / points;
    const drift = phase < 0.2 ? 0.8 : phase > 0.85 ? -1.4 : phase > 0.6 ? 0.6 : 0.25;
    hr += drift + (next() - 0.5) * 3;
    hr = Math.max(118, Math.min(192, hr));
    const t = Math.floor(phase * durationSec);
    out.push({
      t,
      tLabel: `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`,
      hr: Math.round(hr),
      pace: Math.round(260 - phase * 30 + (next() - 0.5) * 10),
      cad: Math.round(168 + (next() - 0.5) * 8),
      elev: Math.round(100 + phase * 80 + (next() - 0.5) * 6),
    });
  }
  return out;
}

function zoneOf(hr: number): Zone {
  return HR_ZONES.find((z) => hr >= z.min && hr < z.max) ?? HR_ZONES[HR_ZONES.length - 1];
}

function timeInZones(samples: { hr: number; t: number }[]): { zone: Zone; sec: number; pct: number }[] {
  const totals = HR_ZONES.map((z) => ({ zone: z, sec: 0, pct: 0 }));
  const totalDur = samples[samples.length - 1]?.t ?? 1;
  for (let i = 1; i < samples.length; i++) {
    const dt = samples[i].t - samples[i - 1].t;
    const z = zoneOf(samples[i].hr);
    const bucket = totals.find((b) => b.zone.name === z.name);
    if (bucket) bucket.sec += dt;
  }
  totals.forEach((b) => (b.pct = totalDur > 0 ? Math.round((b.sec / totalDur) * 100) : 0));
  return totals;
}

type VariantId = "inline-chart" | "aside-zones" | "map-overlay";

export default function SegmentHrPrototype() {
  const [variant, setVariant] = useState<VariantId>("inline-chart");
  return (
    <>
      {variant === "inline-chart" && <InlineChartVariant />}
      {variant === "aside-zones" && <AsideZonesVariant />}
      {variant === "map-overlay" && <MapOverlayVariant />}
      <VariantSwitcher current={variant} onChange={setVariant} />
    </>
  );
}

function useSegment() {
  // Pick a run segment so HR data makes physiological sense
  return SEGMENTS.find((s) => s.sport === "Run" && s.myBestSec) ?? SEGMENTS[1];
}

function SegmentShell({
  middleInjection,
  asidePrepend,
  mapChildren,
}: {
  middleInjection?: React.ReactNode;
  asidePrepend?: React.ReactNode;
  mapChildren?: React.ReactNode;
}) {
  const segment = useSegment();
  const leaderboard = ATHLETES.filter((a) => a.id !== "me")
    .slice(0, 8)
    .map((a, i) => ({
      rank: i + 1,
      athlete: a,
      timeSec: segment.korSec + i * (30 + segment.routeSeed),
    }));
  if (segment.myBestSec) {
    leaderboard.push({ rank: leaderboard.length + 8, athlete: ME, timeSec: segment.myBestSec });
  }

  return (
    <AppShell>
      <a href="/segments" className="text-sm text-muted-foreground hover:text-foreground">
        ← All segments
      </a>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex-1">
          <SportBadge sport={segment.sport} />
          <h1 className="text-4xl font-display font-bold tracking-tight mt-2">{segment.name}</h1>
          <p className="text-muted-foreground mt-1">{segment.location}</p>
        </div>
        <button className="h-10 px-4 rounded-md border border-border text-sm flex items-center gap-2 hover:bg-muted">
          <Star className="h-4 w-4" /> Star segment
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6 my-8">
        <Stat label="Distance" value={segment.distanceKm.toFixed(1)} unit="km" emphasis />
        <Stat label="Avg grade" value={segment.avgGrade.toFixed(1)} unit="%" />
        <Stat label="Elevation" value={segment.elevationM} unit="m" />
        <Stat label="Attempts" value={segment.attempts.toLocaleString()} />
        <Stat label="Athletes" value={segment.athletes.toLocaleString()} />
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-8">
        <div>
          <section className="rounded-xl overflow-hidden border border-border relative">
            <RouteMap
              seed={segment.routeSeed}
              width={1000}
              height={380}
              className="w-full h-[360px]"
              variant="dark"
            />
            {mapChildren}
          </section>

          {middleInjection}

          <h2 className="text-lg font-display font-semibold mt-8 mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> Leaderboard
          </h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3 w-14">Rank</th>
                  <th className="text-left font-medium px-4 py-3">Athlete</th>
                  <th className="text-right font-medium px-4 py-3">Time</th>
                  <th className="text-right font-medium px-4 py-3">Pace</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, i) => {
                  const pace = Math.round(row.timeSec / segment.distanceKm);
                  const m = Math.floor(pace / 60);
                  const s = pace % 60;
                  const isMe = row.athlete.id === "me";
                  return (
                    <tr
                      key={row.athlete.id}
                      className={`border-t border-border ${isMe ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono">
                        {i === 0 ? (
                          <span className="text-primary font-bold">🏆 {row.rank}</span>
                        ) : (
                          row.rank
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/athlete/${row.athlete.id}`} className="flex items-center gap-2 hover:text-primary">
                          <img src={row.athlete.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                          <span className={isMe ? "font-semibold" : ""}>
                            {row.athlete.name}
                            {isMe && " (you)"}
                          </span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{fmtDuration(row.timeSec)}</td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                        {m}:{s.toString().padStart(2, "0")}/km
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          {asidePrepend}
          <div className="bg-secondary text-secondary-foreground rounded-xl p-5">
            <div className="text-xs uppercase tracking-[0.14em] opacity-70">Course record</div>
            <div className="stat-num text-3xl text-primary mt-2">{fmtDuration(segment.korSec)}</div>
            <div className="text-sm opacity-80 mt-1">by {segment.korAthlete}</div>
          </div>
          {segment.myBestSec && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Your PR
              </div>
              <div className="stat-num text-3xl mt-2">{fmtDuration(segment.myBestSec)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {fmtDuration(segment.myBestSec - segment.korSec)} behind KOM
              </div>
            </div>
          )}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Similar segments
            </h3>
            <ul className="space-y-2">
              {SEGMENTS.filter((s) => s.id !== segment.id && s.sport === segment.sport)
                .slice(0, 3)
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/segment/${s.id}`}
                      className="block hover:bg-muted -mx-2 px-2 py-2 rounded"
                    >
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.distanceKm.toFixed(1)} km · {s.avgGrade.toFixed(1)}%
                      </div>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

/* ===== Variant A: inline HR-during-segment chart ===== */

function InlineChartVariant() {
  const segment = useSegment();
  const samples = useMemo(
    () => hrSamples(segment.routeSeed, segment.myBestSec ?? 1500),
    [segment],
  );
  const avgHr = Math.round(samples.reduce((s, p) => s + p.hr, 0) / samples.length);
  const maxHr = Math.max(...samples.map((p) => p.hr));
  const minHr = Math.min(...samples.map((p) => p.hr));
  const zoneTotals = useMemo(() => timeInZones(samples), [samples]);
  const dominantZone = zoneTotals.reduce((a, b) => (a.sec > b.sec ? a : b));
  const [mode, setMode] = useState<"hr" | "hr+pace" | "hr+elev">("hr+pace");

  const section = (
    <section className="mt-8">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-display font-semibold flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" /> Heart rate during your best effort
        </h2>
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList>
            <TabsTrigger value="hr">HR only</TabsTrigger>
            <TabsTrigger value="hr+pace">HR + pace</TabsTrigger>
            <TabsTrigger value="hr+elev">HR + elevation</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="grid grid-cols-[1fr_220px] gap-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={samples}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="tLabel"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  interval={9}
                />
                <YAxis
                  yAxisId="hr"
                  domain={[100, 200]}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                {/* Zone bands */}
                {HR_ZONES.map((z) => (
                  <ReferenceArea
                    key={z.name}
                    yAxisId="hr"
                    y1={z.min}
                    y2={Math.min(z.max, 200)}
                    fill={z.color}
                    fillOpacity={0.08}
                    strokeOpacity={0}
                  />
                ))}
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const v = Number(value);
                    if (name === "hr") return [`${v} bpm · ${zoneOf(v).name}`, "HR"];
                    if (name === "pace")
                      return [
                        `${Math.floor(v / 60)}:${(v % 60).toString().padStart(2, "0")}/km`,
                        "Pace",
                      ];
                    if (name === "elev") return [`${v} m`, "Elevation"];
                    return [String(value), String(name)];
                  }}
                />
                <Area
                  yAxisId="hr"
                  type="monotone"
                  dataKey="hr"
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  fill="url(#hrGrad)"
                />
                {mode === "hr+pace" && (
                  <Line
                    yAxisId="right"
                    dataKey="pace"
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
                {mode === "hr+elev" && (
                  <Line
                    yAxisId="right"
                    dataKey="elev"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="border-l border-border pl-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Time in zones
            </div>
            <ul className="mt-3 space-y-2.5">
              {zoneTotals.map((z) => (
                <li key={z.zone.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-sm"
                        style={{ background: z.zone.color }}
                      />
                      <span className="font-mono">{z.zone.name}</span>
                      <span className="text-muted-foreground">{z.zone.label}</span>
                    </span>
                    <span className="font-mono">{z.pct}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${z.pct}%`, background: z.zone.color }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Avg
                </div>
                <div className="stat-num text-lg">{avgHr}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Max
                </div>
                <div className="stat-num text-lg text-destructive">{maxHr}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Min
                </div>
                <div className="stat-num text-lg">{minHr}</div>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-surface-2 p-3 text-xs">
              <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Dominant
              </span>{" "}
              · {dominantZone.zone.label} — {dominantZone.pct}% of the effort spent in{" "}
              {dominantZone.zone.name}.
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return <SegmentShell middleInjection={section} />;
}

/* ===== Variant B: aside HR card ===== */

function AsideZonesVariant() {
  const segment = useSegment();
  const samples = useMemo(
    () => hrSamples(segment.routeSeed, segment.myBestSec ?? 1500),
    [segment],
  );
  const avgHr = Math.round(samples.reduce((s, p) => s + p.hr, 0) / samples.length);
  const peakHr = Math.max(...samples.map((p) => p.hr));
  const zoneTotals = timeInZones(samples);
  const aerobic = zoneTotals
    .filter((z) => ["Z1", "Z2"].includes(z.zone.name))
    .reduce((s, z) => s + z.pct, 0);
  const threshold = zoneTotals
    .filter((z) => ["Z4", "Z5"].includes(z.zone.name))
    .reduce((s, z) => s + z.pct, 0);

  const aside = (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="p-5 bg-gradient-to-b from-destructive/10 to-transparent border-b border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-destructive" /> Your effort
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            BEST: {fmtDuration(segment.myBestSec ?? 0)}
          </Badge>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="stat-num text-3xl text-destructive">{avgHr}</span>
          <span className="text-xs text-muted-foreground">avg bpm</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">peak {peakHr}</span>
        </div>
        <div className="mt-4 h-3 flex rounded-full overflow-hidden ring-1 ring-border">
          {zoneTotals.map((z) => (
            <TooltipProvider key={z.zone.name}>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{ background: z.zone.color, width: `${z.pct}%` }}
                    className="h-full transition-all"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <div className="font-medium">
                      {z.zone.name} · {z.zone.label}
                    </div>
                    <div className="text-muted-foreground">
                      {fmtDuration(z.sec)} · {z.pct}%
                    </div>
                  </div>
                </TooltipContent>
              </UiTooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {HR_ZONES.map((z) => (
            <span key={z.name}>{z.name}</span>
          ))}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <Row label="Aerobic (Z1–Z2)" value={`${aerobic}%`} />
        <Row label="Threshold+ (Z4–Z5)" value={`${threshold}%`} tone={threshold > 30 ? "warn" : undefined} />
        <Row
          label="Peak / Z5 cap"
          value={`${peakHr} / ${HR_ZONES[4].min}`}
          tone={peakHr > HR_ZONES[4].min + 8 ? "warn" : undefined}
        />
        <Row
          label="Time at peak"
          value={fmtDuration(
            Math.round(
              ((zoneTotals.find((z) => z.zone.name === "Z5")?.sec ?? 0) +
                (zoneTotals.find((z) => z.zone.name === "Z4")?.sec ?? 0) * 0.5),
            ),
          )}
        />
        <div className="rounded-md bg-surface-2 p-3 text-xs text-muted-foreground">
          You spent <span className="text-foreground font-medium">{threshold}%</span> at or above
          threshold — typical of a controlled tempo effort. The final 200m pushed into{" "}
          <span className="text-destructive">Z5</span>.
        </div>
        <a
          href="#"
          className="mt-2 flex items-center justify-between text-xs text-foreground underline-offset-4 hover:underline"
        >
          See all attempts <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );

  return <SegmentShell asidePrepend={aside} />;
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${tone === "warn" ? "text-destructive" : ""}`}>{value}</span>
    </div>
  );
}

/* ===== Variant C: HR overlay on the segment map ===== */

function MapOverlayVariant() {
  const segment = useSegment();
  const samples = useMemo(
    () => hrSamples(segment.routeSeed, segment.myBestSec ?? 1500),
    [segment],
  );
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const active = hoverIdx ?? Math.floor(samples.length / 2);
  const point = samples[active];
  const zone = zoneOf(point.hr);

  const overlay = (
    <>
      <div className="absolute inset-0 flex items-end pointer-events-none">
        <svg viewBox="0 0 1000 160" className="w-full h-32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hrOverlayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.65 0.20 25)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="oklch(0.78 0.10 145)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* HR ribbon along bottom of map */}
          <path
            d={samples
              .map((p, i) => {
                const x = (i / (samples.length - 1)) * 1000;
                const y = 160 - ((p.hr - 110) / 80) * 90;
                return `${i === 0 ? "M" : "L"} ${x},${y}`;
              })
              .join(" ")
              .concat(` L 1000,160 L 0,160 Z`)}
            fill="url(#hrOverlayGrad)"
            stroke="none"
          />
          <path
            d={samples
              .map((p, i) => {
                const x = (i / (samples.length - 1)) * 1000;
                const y = 160 - ((p.hr - 110) / 80) * 90;
                return `${i === 0 ? "M" : "L"} ${x},${y}`;
              })
              .join(" ")}
            stroke="var(--destructive)"
            strokeWidth={2}
            fill="none"
          />
        </svg>
      </div>
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-2 rounded-md border border-border">
        <Heart className="h-3.5 w-3.5 text-destructive" />
        <div className="text-xs">
          <div className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
            HR overlay · live
          </div>
          <div className="mt-0.5 font-medium">
            <span className="text-destructive">{point.hr} bpm</span>{" "}
            <span className="text-muted-foreground">@ {point.tLabel}</span>{" "}
            <span className="font-mono text-[10px] ml-1" style={{ color: zone.color }}>
              {zone.name} · {zone.label}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-background/90 backdrop-blur border border-border p-1.5">
        {HR_ZONES.map((z) => (
          <div key={z.name} className="flex items-center gap-1 text-[10px] font-mono px-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: z.color }} />
            {z.name}
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <input
          type="range"
          min={0}
          max={samples.length - 1}
          value={active}
          onChange={(e) => setHoverIdx(Number(e.target.value))}
          className="w-full accent-[var(--destructive)] pointer-events-auto"
        />
      </div>
    </>
  );

  // mini chart below map showing the same trace
  const middle = (
    <section className="mt-6 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
          <ActivityIcon className="h-3.5 w-3.5" /> HR trace · scrub the map to inspect
        </div>
        <div className="text-xs text-muted-foreground">
          {samples.length} samples · 1 per {Math.round((segment.myBestSec ?? 1500) / samples.length)}s
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={samples}>
            <defs>
              <linearGradient id="hrTrace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="tLabel" hide />
            <YAxis domain={[100, 200]} hide />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="hr"
              stroke="var(--destructive)"
              strokeWidth={2}
              fill="url(#hrTrace)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );

  return <SegmentShell mapChildren={overlay} middleInjection={middle} />;
}

/* ===== Switcher ===== */

function VariantSwitcher({
  current,
  onChange,
}: {
  current: VariantId;
  onChange: (v: VariantId) => void;
}) {
  const options: { id: VariantId; label: string }[] = [
    { id: "inline-chart", label: "Inline chart" },
    { id: "aside-zones", label: "Aside zones" },
    { id: "map-overlay", label: "Map overlay" },
  ];
  return (
    <div className="fixed left-1/2 bottom-5 -translate-x-1/2 z-50">
      <div className="rounded-full border border-border bg-background/95 backdrop-blur shadow-lg p-1 flex items-center gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              current === opt.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
