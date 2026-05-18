import { useState } from "react";
import {
  ACTIVITIES,
  fmtDate,
  fmtDuration,
  ME,
  weeklyStats,
  type Sport,
} from "@/lib/mock-data";
import { AppShell } from "@/components/AppShell";
import { ActivityCard } from "@/components/ActivityCard";
import { SportBadge } from "@/components/SportBadge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  MapPin,
  Trophy,
  Flame,
  Mountain,
  Sunrise,
  Compass,
  Crown,
  Zap,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Tier = "bronze" | "silver" | "gold" | "platinum";
type Category = "Streaks" | "Climbing" | "Distance" | "Speed" | "Explorer";

type Achievement = {
  id: string;
  name: string;
  description: string;
  category: Category;
  tier: Tier;
  icon: typeof Trophy;
  progress: number;
  target: number;
  unit: string;
  unlockedDate?: string;
  sport?: Sport;
  isNew?: boolean;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    name: "Morning Strider",
    description: "Complete 10 activities before 7am.",
    category: "Streaks",
    tier: "silver",
    icon: Sunrise,
    progress: 10,
    target: 10,
    unit: "runs",
    unlockedDate: "2026-04-21",
    sport: "Run",
    isNew: true,
  },
  {
    id: "ach-2",
    name: "Centurion",
    description: "Run 100km in a single week.",
    category: "Distance",
    tier: "gold",
    icon: Crown,
    progress: 100,
    target: 100,
    unit: "km",
    unlockedDate: "2026-04-12",
    sport: "Run",
    isNew: true,
  },
  {
    id: "ach-3",
    name: "Streak of 30",
    description: "Activity logged every day for a month.",
    category: "Streaks",
    tier: "gold",
    icon: Flame,
    progress: 21,
    target: 30,
    unit: "days",
  },
  {
    id: "ach-4",
    name: "Five Summits",
    description: "Hike or ride 5 named summits.",
    category: "Climbing",
    tier: "silver",
    icon: Mountain,
    progress: 3,
    target: 5,
    unit: "peaks",
  },
  {
    id: "ach-5",
    name: "Local Hero",
    description: "Take the KOM on any segment in your home city.",
    category: "Speed",
    tier: "platinum",
    icon: Zap,
    progress: 0,
    target: 1,
    unit: "KOM",
  },
  {
    id: "ach-6",
    name: "Off the Map",
    description: "Visit 25 unique segments.",
    category: "Explorer",
    tier: "silver",
    icon: Compass,
    progress: 18,
    target: 25,
    unit: "segments",
  },
  {
    id: "ach-7",
    name: "Vertical Mile",
    description: "Climb 1,609m in a single ride.",
    category: "Climbing",
    tier: "gold",
    icon: Mountain,
    progress: 1340,
    target: 1609,
    unit: "m",
    sport: "Ride",
  },
  {
    id: "ach-8",
    name: "Sub-4 Marathon",
    description: "Finish a marathon distance under 4 hours.",
    category: "Speed",
    tier: "gold",
    icon: Zap,
    progress: 0,
    target: 1,
    unit: "race",
    sport: "Run",
  },
  {
    id: "ach-9",
    name: "First Footprint",
    description: "Log your first activity.",
    category: "Streaks",
    tier: "bronze",
    icon: Star,
    progress: 1,
    target: 1,
    unit: "activity",
    unlockedDate: "2025-08-04",
  },
];

const TIER_TONE: Record<Tier, { ring: string; text: string; chip: string; gradient: string }> = {
  bronze: {
    ring: "ring-[#a47148]/40",
    text: "text-[#a47148]",
    chip: "bg-[#a47148]/12 text-[#a47148]",
    gradient: "from-[#a47148]/30 to-[#a47148]/0",
  },
  silver: {
    ring: "ring-[#9aa1ad]/50",
    text: "text-[#9aa1ad]",
    chip: "bg-[#9aa1ad]/12 text-[#9aa1ad]",
    gradient: "from-[#9aa1ad]/30 to-[#9aa1ad]/0",
  },
  gold: {
    ring: "ring-[#d6a648]/50",
    text: "text-[#d6a648]",
    chip: "bg-[#d6a648]/14 text-[#d6a648]",
    gradient: "from-[#d6a648]/30 to-[#d6a648]/0",
  },
  platinum: {
    ring: "ring-primary/60",
    text: "text-primary",
    chip: "bg-primary/14 text-primary",
    gradient: "from-primary/30 to-primary/0",
  },
};

type VariantId = "inline-gallery" | "aside-tracker" | "header-pulse";

export default function AchievementsPrototype() {
  const [variant, setVariant] = useState<VariantId>("inline-gallery");
  return (
    <>
      {variant === "inline-gallery" && <InlineGalleryVariant />}
      {variant === "aside-tracker" && <AsideTrackerVariant />}
      {variant === "header-pulse" && <HeaderPulseVariant />}
      <VariantSwitcher current={variant} onChange={setVariant} />
    </>
  );
}

function ProfileShell({
  inlineBlock,
  asideReplacement,
  headerTrailing,
}: {
  inlineBlock?: React.ReactNode;
  asideReplacement?: React.ReactNode;
  headerTrailing?: React.ReactNode;
}) {
  const athlete = ME;
  const acts = ACTIVITIES.filter((a) => a.athleteId === athlete.id);
  const weeks = weeklyStats(athlete.id);
  const totalKm = acts.reduce((s, a) => s + a.distanceKm, 0);
  const totalTime = acts.reduce((s, a) => s + a.movingSeconds, 0);
  const totalElev = acts.reduce((s, a) => s + a.elevationM, 0);

  return (
    <AppShell>
      <div className="border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Athlete profile
        </div>
        <div className="mt-4 flex items-start gap-6">
          <img
            src={athlete.avatar}
            alt={athlete.name}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-[-0.02em]">
              {athlete.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>@{athlete.handle}</span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {athlete.city}, {athlete.country}
              </span>
            </div>
            {athlete.bio && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/80">{athlete.bio}</p>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-3">
            {headerTrailing}
            <button className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95">
              Record activity
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-5 border border-border">
        <BigStat label="Followers" value={athlete.followers.toLocaleString()} />
        <BigStat label="Following" value={athlete.following.toLocaleString()} />
        <BigStat label="Activities" value={acts.length} />
        <BigStat label="Distance" value={`${totalKm.toFixed(0)} km`} />
        <BigStat label="Elevation" value={`${totalElev.toLocaleString()} m`} />
      </div>

      {inlineBlock}

      <div className="grid grid-cols-[1fr_320px] gap-8 mt-10">
        <div className="min-w-0">
          <section className="bg-surface rounded-xl border border-border p-5 mb-8">
            <h2 className="text-base font-display font-semibold mb-4">Last 8 weeks</h2>
            <div className="h-56">
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

          <h2 className="text-lg font-display font-semibold mb-4">Recent activities</h2>
          <div className="space-y-5">
            {acts.length === 0 && (
              <div className="text-muted-foreground bg-surface border border-border rounded-xl p-8 text-center">
                No activities yet.
              </div>
            )}
            {acts.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">
              All-time totals
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-mono">{fmtDuration(totalTime)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-mono">{totalKm.toFixed(1)} km</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Elevation</span>
                <span className="font-mono">{totalElev.toLocaleString()} m</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Activities</span>
                <span className="font-mono">{acts.length}</span>
              </li>
            </ul>
          </div>
          {asideReplacement ?? (
            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3 flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-primary" /> Trophy case
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {["🥇", "🏔️", "🏃", "💯", "🔥", "⚡"].map((e, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-surface-2 grid place-items-center text-2xl"
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Latest sport
            </h3>
            <div className="flex items-center gap-2 text-sm">
              {acts[0] ? (
                <>
                  <SportBadge sport={acts[0].sport} />
                  <span className="text-muted-foreground">on {fmtDate(acts[0].date)}</span>
                </>
              ) : (
                <span className="text-muted-foreground">No activities yet</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function BigStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface p-4 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-border">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="stat-num mt-2 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

/* ===== Variant A: Inline gallery between stats and feed ===== */

function InlineGalleryVariant() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlockedDate);
  const inProgress = ACHIEVEMENTS.filter((a) => !a.unlockedDate);
  const [category, setCategory] = useState<"All" | Category>("All");
  const [open, setOpen] = useState<Achievement | null>(null);

  const filtered = (list: Achievement[]) =>
    category === "All" ? list : list.filter((a) => a.category === category);

  const newCount = unlocked.filter((a) => a.isNew).length;

  const inline = (
    <section className="mt-8 rounded-xl border border-border bg-surface overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="font-display text-base font-semibold">Achievements</h2>
          {newCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" /> {newCount} new
            </Badge>
          )}
        </div>
        <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <TabsList>
            {(["All", "Streaks", "Climbing", "Distance", "Speed", "Explorer"] as const).map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>
      <div className="px-5 pt-5 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Unlocked · {filtered(unlocked).length}
      </div>
      <div className="px-5 grid grid-cols-6 gap-3 pb-5">
        {filtered(unlocked).map((a) => (
          <AchievementMedallion key={a.id} achievement={a} onClick={() => setOpen(a)} />
        ))}
        {filtered(unlocked).length === 0 && (
          <div className="col-span-6 text-sm text-muted-foreground py-6 text-center">
            None unlocked in this category yet.
          </div>
        )}
      </div>
      <div className="px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground border-t border-border">
        In progress · {filtered(inProgress).length}
      </div>
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        {filtered(inProgress).map((a) => (
          <button
            key={a.id}
            onClick={() => setOpen(a)}
            className="text-left flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-foreground/30 transition-colors"
          >
            <div className={`relative grid h-12 w-12 place-items-center rounded-full bg-surface-2 ring-1 ${TIER_TONE[a.tier].ring}`}>
              <a.icon className={`h-5 w-5 ${TIER_TONE[a.tier].text}`} />
              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-background border border-border">
                <Lock className="h-2.5 w-2.5 text-muted-foreground" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{a.name}</div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full bg-primary transition-all`}
                  style={{ width: `${Math.round((a.progress / a.target) * 100)}%` }}
                />
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {a.progress} / {a.target} {a.unit}
              </div>
            </div>
          </button>
        ))}
      </div>
      <AchievementDialog achievement={open} onClose={() => setOpen(null)} />
    </section>
  );

  return <ProfileShell inlineBlock={inline} />;
}

function AchievementMedallion({
  achievement,
  onClick,
}: {
  achievement: Achievement;
  onClick: () => void;
}) {
  const tone = TIER_TONE[achievement.tier];
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center text-center"
    >
      <div className={`relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b ${tone.gradient} ring-2 ${tone.ring} transition-transform group-hover:-translate-y-0.5`}>
        <achievement.icon className={`h-6 w-6 ${tone.text}`} />
        {achievement.isNew && (
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            ✦
          </span>
        )}
      </div>
      <div className="mt-2 text-xs font-medium truncate w-full">{achievement.name}</div>
      <div className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${tone.text}`}>
        {achievement.tier}
      </div>
    </button>
  );
}

function AchievementDialog({
  achievement,
  onClose,
}: {
  achievement: Achievement | null;
  onClose: () => void;
}) {
  if (!achievement) return null;
  const tone = TIER_TONE[achievement.tier];
  const pct = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));
  return (
    <Dialog open={!!achievement} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b ${tone.gradient} ring-2 ${tone.ring}`}>
              <achievement.icon className={`h-5 w-5 ${tone.text}`} />
            </div>
            <div>
              <div>{achievement.name}</div>
              <div className={`font-mono text-[10px] uppercase tracking-[0.18em] ${tone.text}`}>
                {achievement.tier} · {achievement.category}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {achievement.unlockedDate ? (
          <div className="rounded-md bg-surface-2 p-3 text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Unlocked on {fmtDate(achievement.unlockedDate)}
            {achievement.isNew && (
              <Badge className="ml-auto bg-primary text-primary-foreground">New</Badge>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Progress value={pct} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {achievement.progress} / {achievement.target} {achievement.unit}
              </span>
              <span className="font-mono">{pct}%</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ===== Variant B: Aside tracker replaces trophy case ===== */

function AsideTrackerVariant() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlockedDate);
  const inProgress = ACHIEVEMENTS.filter((a) => !a.unlockedDate)
    .sort((a, b) => b.progress / b.target - a.progress / a.target)
    .slice(0, 3);
  const newCount = unlocked.filter((a) => a.isNew).length;
  const [showAll, setShowAll] = useState(false);

  const aside = (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="p-5 bg-gradient-to-b from-primary/8 to-transparent border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-primary" /> Achievements
          </h3>
          <Badge className="bg-primary text-primary-foreground text-[10px]">
            {unlocked.length} of {ACHIEVEMENTS.length}
          </Badge>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="stat-num text-3xl font-bold">{unlocked.length}</span>
          <span className="text-xs text-muted-foreground">unlocked</span>
          {newCount > 0 && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary font-medium">
              <Sparkles className="h-3 w-3" /> {newCount} new
            </span>
          )}
        </div>
        <Progress
          value={Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}
          className="mt-3 h-1.5"
        />
      </div>
      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
          Closest unlocks
        </div>
        <ul className="space-y-3">
          {inProgress.map((a) => {
            const pct = Math.round((a.progress / a.target) * 100);
            const tone = TIER_TONE[a.tier];
            return (
              <li key={a.id} className="flex items-center gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-full bg-surface-2 ring-1 ${tone.ring}`}>
                  <a.icon className={`h-4 w-4 ${tone.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{a.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-surface-2 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Dialog open={showAll} onOpenChange={setShowAll}>
          <DialogTrigger asChild>
            <button className="mt-4 w-full text-center text-xs text-foreground underline-offset-4 hover:underline">
              See all achievements →
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>All achievements</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3 mt-2 max-h-[60vh] overflow-y-auto">
              {ACHIEVEMENTS.map((a) => {
                const tone = TIER_TONE[a.tier];
                const pct = Math.round((a.progress / a.target) * 100);
                return (
                  <div
                    key={a.id}
                    className={`rounded-lg border border-border p-3 ${a.unlockedDate ? "bg-surface" : "bg-surface-2"}`}
                  >
                    <div className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b ${tone.gradient} ring-2 ${tone.ring}`}>
                      <a.icon className={`h-4 w-4 ${tone.text}`} />
                    </div>
                    <div className="mt-2 text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{a.description}</div>
                    <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                      {a.unlockedDate ? `Unlocked ${fmtDate(a.unlockedDate)}` : `${pct}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return <ProfileShell asideReplacement={aside} />;
}

/* ===== Variant C: Header pulse + reveal panel ===== */

function HeaderPulseVariant() {
  const newOnes = ACHIEVEMENTS.filter((a) => a.isNew);

  const trailing =
    newOnes.length > 0 ? (
      <Dialog defaultOpen={false}>
        <DialogTrigger asChild>
          <button className="relative inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/8 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-primary/12 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>
              {newOnes.length} new achievement{newOnes.length === 1 ? "" : "s"}
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Recently unlocked
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {newOnes.map((a) => {
              const tone = TIER_TONE[a.tier];
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-border bg-surface overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${tone.gradient}`} />
                  <div className="flex items-start gap-4 p-4">
                    <div className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b ${tone.gradient} ring-2 ${tone.ring}`}>
                      <a.icon className={`h-6 w-6 ${tone.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-semibold">{a.name}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${tone.text}`}>
                          {a.tier}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Unlocked {a.unlockedDate ? fmtDate(a.unlockedDate) : "recently"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    ) : null;

  const aside = (
    <div className="bg-surface rounded-xl border border-border p-5">
      <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-primary" /> On the path
      </h3>
      <ul className="space-y-4">
        {ACHIEVEMENTS.filter((a) => !a.unlockedDate)
          .slice(0, 3)
          .map((a) => {
            const tone = TIER_TONE[a.tier];
            const pct = Math.round((a.progress / a.target) * 100);
            return (
              <li key={a.id}>
                <div className="flex items-center gap-2">
                  <a.icon className={`h-3.5 w-3.5 ${tone.text}`} />
                  <span className="text-sm font-medium truncate flex-1">{a.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );

  return <ProfileShell asideReplacement={aside} headerTrailing={trailing} />;
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
    { id: "inline-gallery", label: "Inline gallery" },
    { id: "aside-tracker", label: "Aside tracker" },
    { id: "header-pulse", label: "Header pulse" },
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
