import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ACTIVITIES, fmtDuration, weeklyStats, type Sport } from "@/lib/mock-data";
import { AppShell } from "@/components/AppShell";
import { AnalyticsCard } from "@/components/AnalyticsCard";
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
import { SportBadge } from "@/components/SportBadge";
import { Activity, Clock, Mountain, Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training Log — Stride" },
      { name: "description", content: "All your activities, week by week." },
    ],
  }),
  component: Training,
});

const SPORT_COLORS: Record<Sport, string> = {
  Run: "var(--primary)",
  Ride: "var(--accent)",
  Swim: "oklch(0.6 0.18 230)",
  Hike: "oklch(0.55 0.15 145)",
  Walk: "oklch(0.7 0.05 80)",
};

function Training() {
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
  const weeklyKm = weeks.map((week) => week.km);
  const weekDelta = weeklyKm.length > 1 ? weeklyKm.at(-1)! - weeklyKm.at(-2)! : 0;
  const weekDeltaLabel = `${Math.abs(weekDelta).toFixed(1)} km vs last week`;
  const trend = weekDelta > 0 ? "up" : weekDelta < 0 ? "down" : "flat";

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Every effort, logged.</p>
        <h1 className="text-3xl font-display font-bold tracking-tight mt-1">Training log</h1>
      </div>

      <div className="grid gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          label="Activities"
          value={totals.count}
          delta={`${filtered.length} logged`}
          deltaLabel={sport === "All" ? "all sports" : sport}
          icon={<Activity className="h-4 w-4" />}
        />
        <AnalyticsCard
          label="Distance"
          value={totals.km.toFixed(1)}
          unit="km"
          trend={trend}
          delta={weekDelta === 0 ? "Even" : weekDelta > 0 ? "Up" : "Down"}
          deltaLabel={weekDeltaLabel}
          data={weeklyKm}
          icon={<RouteIcon className="h-4 w-4" />}
        />
        <AnalyticsCard
          label="Time"
          value={fmtDuration(totals.time)}
          delta={`${Math.round(totals.time / Math.max(totals.count, 1) / 60)} min`}
          deltaLabel="avg moving time"
          icon={<Clock className="h-4 w-4" />}
        />
        <AnalyticsCard
          label="Elevation"
          value={totals.elev.toLocaleString()}
          unit="m"
          delta={`${Math.round(totals.elev / Math.max(totals.km, 1))} m/km`}
          deltaLabel="climb density"
          icon={<Mountain className="h-4 w-4" />}
        />
      </div>

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
