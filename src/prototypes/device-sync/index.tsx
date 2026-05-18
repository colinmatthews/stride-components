import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  Bluetooth,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Watch,
  WifiOff,
} from "lucide-react";
import {
  ACTIVITIES,
  fmtDuration,
  weeklyStats,
  type Sport,
} from "@/lib/mock-data";
import { AppShell } from "@/components/AppShell";
import { SportBadge } from "@/components/SportBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const SPORT_COLORS: Record<Sport, string> = {
  Run: "var(--primary)",
  Ride: "var(--accent)",
  Swim: "oklch(0.6 0.18 230)",
  Hike: "oklch(0.55 0.15 145)",
  Walk: "oklch(0.7 0.05 80)",
};

type DeviceStatus = "ok" | "warning" | "error";
type Device = {
  id: string;
  name: string;
  model: string;
  type: "watch" | "bike" | "strap" | "phone";
  status: DeviceStatus;
  lastSyncMinutesAgo: number;
  battery: number;
  detail: string;
  fix: string;
  pendingActivities: number;
};

const DEVICES: Device[] = [
  {
    id: "dev-1",
    name: "Garmin Forerunner 965",
    model: "FR965 · firmware 18.16",
    type: "watch",
    status: "error",
    lastSyncMinutesAgo: 1880,
    battery: 12,
    detail: "Connect IQ token expired 31 hours ago.",
    fix: "Re-authorize Garmin Connect to resume sync.",
    pendingActivities: 3,
  },
  {
    id: "dev-2",
    name: "Wahoo Kickr",
    model: "Kickr v6 · 1.4.21",
    type: "bike",
    status: "warning",
    lastSyncMinutesAgo: 220,
    battery: 0,
    detail: "Bluetooth handshake retried 4× — power data partial.",
    fix: "Move bridge closer to the trainer and retry.",
    pendingActivities: 1,
  },
  {
    id: "dev-3",
    name: "Polar H10 Chest Strap",
    model: "H10 · firmware 3.2.1",
    type: "strap",
    status: "ok",
    lastSyncMinutesAgo: 6,
    battery: 78,
    detail: "Heart rate stream healthy on last 4 sessions.",
    fix: "",
    pendingActivities: 0,
  },
  {
    id: "dev-4",
    name: "iPhone Health",
    model: "iOS 18 · auto-import",
    type: "phone",
    status: "ok",
    lastSyncMinutesAgo: 12,
    battery: 64,
    detail: "Auto-import healthy.",
    fix: "",
    pendingActivities: 0,
  },
];

function deviceIcon(type: Device["type"]) {
  if (type === "watch") return Watch;
  if (type === "bike") return Bluetooth;
  if (type === "strap") return RefreshCw;
  return WifiOff;
}

function statusTone(status: DeviceStatus) {
  if (status === "error")
    return {
      border: "border-destructive/40",
      bg: "bg-destructive/8",
      text: "text-destructive",
      dot: "bg-destructive",
      label: "Sync failing",
    };
  if (status === "warning")
    return {
      border: "border-[color:var(--accent)]/40",
      bg: "bg-[color:var(--accent)]/8",
      text: "text-[color:var(--accent)]",
      dot: "bg-[color:var(--accent)]",
      label: "Degraded",
    };
  return {
    border: "border-border",
    bg: "bg-surface-2",
    text: "text-muted-foreground",
    dot: "bg-[color:var(--pr)]",
    label: "Healthy",
  };
}

function lastSyncLabel(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / (60 * 24))}d ago`;
}

type VariantId = "banner" | "inline" | "header-chip";

export default function DeviceSyncPrototype() {
  const [variant, setVariant] = useState<VariantId>("banner");
  return (
    <>
      {variant === "banner" && <BannerVariant />}
      {variant === "inline" && <InlineVariant />}
      {variant === "header-chip" && <HeaderChipVariant />}
      <VariantSwitcher current={variant} onChange={setVariant} />
    </>
  );
}

function TrainingShell({
  topInjection,
  sectionInjection,
}: {
  topInjection?: React.ReactNode;
  sectionInjection?: React.ReactNode;
}) {
  const my = useMemo(() => ACTIVITIES.filter((a) => a.athleteId === "me"), []);
  const weeks = weeklyStats("me");
  const [sport, setSport] = useState<"All" | Sport>("All");

  const sportBreakdown = useMemo(() => {
    const map = new Map<Sport, number>();
    my.forEach((a) => map.set(a.sport, (map.get(a.sport) ?? 0) + a.distanceKm));
    return Array.from(map.entries()).map(([s, km]) => ({
      name: s,
      value: Math.round(km * 10) / 10,
    }));
  }, [my]);

  const filtered = sport === "All" ? my : my.filter((a) => a.sport === sport);
  const totals = filtered.reduce(
    (acc, a) => ({
      km: acc.km + a.distanceKm,
      time: acc.time + a.movingSeconds,
      elev: acc.elev + a.elevationM,
      count: acc.count + 1,
    }),
    { km: 0, time: 0, elev: 0, count: 0 },
  );

  return (
    <AppShell>
      {topInjection}

      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Every effort, logged.</p>
        <h1 className="text-3xl font-display font-bold tracking-tight mt-1">Training log</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard label="Activities" value={totals.count} />
        <KpiCard label="Distance" value={`${totals.km.toFixed(1)} km`} />
        <KpiCard label="Time" value={fmtDuration(totals.time)} />
        <KpiCard label="Elevation" value={`${totals.elev.toLocaleString()} m`} />
      </div>

      {sectionInjection}

      <div className="grid grid-cols-3 gap-6 mb-10">
        <section className="bg-surface border border-border rounded-xl p-5 col-span-2">
          <h2 className="text-base font-display font-semibold mb-4">Weekly volume (km)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="km" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-base font-display font-semibold mb-4">Sport breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sportBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {sportBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={SPORT_COLORS[entry.name as Sport]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold">All activities</h2>
        <div className="flex gap-1 bg-surface-2 rounded-md p-1">
          {(["All", "Run", "Ride", "Swim", "Hike", "Walk"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`px-3 py-1.5 text-xs rounded ${
                sport === s
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">Date</th>
              <th className="text-left font-medium px-4 py-3">Activity</th>
              <th className="text-left font-medium px-4 py-3">Sport</th>
              <th className="text-right font-medium px-4 py-3">Distance</th>
              <th className="text-right font-medium px-4 py-3">Time</th>
              <th className="text-right font-medium px-4 py-3">Elev</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-surface-2">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {new Date(a.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <a href={`/activity/${a.id}`} className="hover:text-primary font-medium">
                    {a.title}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <SportBadge sport={a.sport} />
                </td>
                <td className="px-4 py-3 text-right font-mono">{a.distanceKm.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono">{fmtDuration(a.movingSeconds)}</td>
                <td className="px-4 py-3 text-right font-mono">{a.elevationM} m</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No activities for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="stat-num text-2xl mt-1">{value}</div>
    </div>
  );
}

/* ============================== Variant A: Banner ============================== */

function BannerVariant() {
  const [resolved, setResolved] = useState<string[]>([]);
  const issues = DEVICES.filter((d) => d.status !== "ok" && !resolved.includes(d.id));
  const errors = issues.filter((d) => d.status === "error").length;
  const warnings = issues.filter((d) => d.status === "warning").length;
  const pending = issues.reduce((s, d) => s + d.pendingActivities, 0);

  const top = issues.length > 0 ? (
    <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/8 overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">
            {pending} {pending === 1 ? "activity" : "activities"} not in your log yet
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {errors > 0 && (
              <span className="text-destructive font-medium">
                {errors} device{errors === 1 ? "" : "s"} failing
              </span>
            )}
            {errors > 0 && warnings > 0 && <span className="text-border mx-1.5">·</span>}
            {warnings > 0 && (
              <span>
                {warnings} degraded
              </span>
            )}
            <span className="text-border mx-1.5">·</span>
            <span>Last successful sync 6 minutes ago (Polar H10)</span>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="shrink-0">
              Review devices <ChevronRight className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Connected devices</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              {DEVICES.map((d) => (
                <DeviceRow
                  key={d.id}
                  device={d}
                  resolved={resolved.includes(d.id)}
                  onResolve={() => setResolved((r) => [...r, d.id])}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="border-t border-destructive/20 bg-background/40 px-5 py-2.5 flex items-center gap-4 text-xs">
        {issues.map((d) => {
          const tone = statusTone(d.status);
          return (
            <span key={d.id} className="inline-flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground">
                {d.name.split(" ")[0]}
              </span>
              <span className={tone.text + " font-medium"}>
                {lastSyncLabel(d.lastSyncMinutesAgo)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="mb-8 rounded-xl border border-border bg-surface px-5 py-3 flex items-center gap-3 text-sm">
      <CheckCircle2 className="h-4 w-4 text-[color:var(--pr)]" />
      <span className="text-muted-foreground">All devices syncing normally.</span>
    </div>
  );

  return <TrainingShell topInjection={top} />;
}

/* ============================== Variant B: Inline section ============================== */

function InlineVariant() {
  const [openId, setOpenId] = useState<string | null>(DEVICES.find((d) => d.status === "error")?.id ?? null);

  const section = (
    <section className="mb-10 rounded-xl border border-border bg-surface overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-base font-display font-semibold">Connected devices</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Activities flow from your devices into the log below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">
            {DEVICES.filter((d) => d.status === "error").length} failing
          </Badge>
          <Badge variant="outline">
            {DEVICES.filter((d) => d.status === "warning").length} degraded
          </Badge>
        </div>
      </header>
      <ul className="divide-y divide-border">
        {DEVICES.map((d) => {
          const tone = statusTone(d.status);
          const Icon = deviceIcon(d.type);
          const open = openId === d.id;
          return (
            <li key={d.id} className={tone.bg}>
              <button
                onClick={() => setOpenId(open ? null : d.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-background/40 transition-colors"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-md bg-background/60 border ${tone.border}`}>
                  <Icon className={`h-4 w-4 ${tone.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{d.name}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                    <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${tone.text}`}>
                      {tone.label}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {d.model} · last sync {lastSyncLabel(d.lastSyncMinutesAgo)}
                    {d.pendingActivities > 0 && (
                      <span className="ml-2 text-destructive font-medium">
                        {d.pendingActivities} pending
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
                />
              </button>
              {open && (
                <div className="px-5 pb-5 -mt-1">
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="text-sm">{d.detail}</p>
                    {d.fix && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-mono uppercase tracking-[0.18em] text-foreground/80">
                          Next step
                        </span>{" "}
                        — {d.fix}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm">Re-authorize</Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3.5 w-3.5" /> Retry now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );

  return <TrainingShell sectionInjection={section} />;
}

/* ============================== Variant C: Header chip + dialog ============================== */

function HeaderChipVariant() {
  const errors = DEVICES.filter((d) => d.status === "error").length;
  const warnings = DEVICES.filter((d) => d.status === "warning").length;
  const pending = DEVICES.reduce((s, d) => s + d.pendingActivities, 0);
  const hasIssues = errors + warnings > 0;
  const [resolved, setResolved] = useState<string[]>([]);

  const chip = (
    <div className="mb-6 flex items-center justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
              hasIssues
                ? "border-destructive/40 bg-destructive/8 text-destructive hover:bg-destructive/12"
                : "border-border bg-surface text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {hasIssues && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  hasIssues ? "bg-destructive" : "bg-[color:var(--pr)]"
                }`}
              />
            </span>
            <span className="font-mono uppercase tracking-[0.18em]">
              {hasIssues
                ? `${pending} activit${pending === 1 ? "y" : "ies"} stuck`
                : "All devices healthy"}
            </span>
            {hasIssues && (
              <span className="text-muted-foreground">
                {errors} failing · {warnings} degraded
              </span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Sync status
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3">
            {DEVICES.map((d) => (
              <DeviceRow
                key={d.id}
                device={d}
                resolved={resolved.includes(d.id)}
                onResolve={() => setResolved((r) => [...r, d.id])}
              />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sync log retained 30 days</span>
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              Sync history
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return <TrainingShell topInjection={chip} />;
}

function DeviceRow({
  device,
  resolved,
  onResolve,
}: {
  device: Device;
  resolved: boolean;
  onResolve: () => void;
}) {
  const tone = statusTone(resolved ? "ok" : device.status);
  const Icon = deviceIcon(device.type);
  return (
    <div className={`rounded-lg border ${tone.border} ${tone.bg} p-3.5`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-md bg-background/60`}>
          <Icon className={`h-4 w-4 ${tone.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{device.name}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${tone.text}`}>
              {resolved ? "Reconnecting" : tone.label}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {device.model} · {lastSyncLabel(device.lastSyncMinutesAgo)}
            {device.battery > 0 && <span> · {device.battery}% battery</span>}
          </div>
          {!resolved && device.status !== "ok" && (
            <>
              <p className="mt-2 text-xs">{device.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">{device.fix}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <Button size="sm" onClick={onResolve}>
                  Re-authorize
                </Button>
                <Button size="sm" variant="outline" onClick={onResolve}>
                  <RefreshCw className="h-3.5 w-3.5" /> Retry
                </Button>
              </div>
            </>
          )}
          {resolved && (
            <p className="mt-2 text-xs text-[color:var(--pr)]">
              Re-auth queued. Activities will appear once Garmin confirms the token.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================== Variant switcher ============================== */

function VariantSwitcher({
  current,
  onChange,
}: {
  current: VariantId;
  onChange: (v: VariantId) => void;
}) {
  const options: { id: VariantId; label: string }[] = [
    { id: "banner", label: "Inbox banner" },
    { id: "inline", label: "Inline section" },
    { id: "header-chip", label: "Header status chip" },
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

