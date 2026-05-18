import { useState } from "react";
import {
  ACTIVITIES,
  fmtDate,
  fmtDuration,
  ME,
  weeklyStats,
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
  Sparkles,
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Heart,
  Map,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type PlanId = "free" | "summit" | "summit-yearly";

type Plan = {
  id: PlanId;
  name: string;
  priceUsd: number;
  period: "month" | "year";
  monthlyEquivalent: number;
  blurb: string;
  features: { icon: typeof Crown; text: string }[];
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Stride Free",
    priceUsd: 0,
    period: "month",
    monthlyEquivalent: 0,
    blurb: "Track every effort. Compare with friends.",
    features: [
      { icon: Heart, text: "Unlimited activities & basic stats" },
      { icon: Map, text: "Public segments & leaderboards" },
      { icon: Zap, text: "30-day training history" },
    ],
  },
  {
    id: "summit",
    name: "Summit",
    priceUsd: 11,
    period: "month",
    monthlyEquivalent: 11,
    blurb: "Deeper training, better recovery, advanced segments.",
    features: [
      { icon: Crown, text: "Segment leaderboards & live grouping" },
      { icon: Heart, text: "Heart rate zones & relative effort" },
      { icon: Map, text: "Custom routes & turn-by-turn export" },
      { icon: Zap, text: "Unlimited training history" },
    ],
    badge: "Most popular",
  },
  {
    id: "summit-yearly",
    name: "Summit · Yearly",
    priceUsd: 89,
    period: "year",
    monthlyEquivalent: 7.42,
    blurb: "Everything in Summit. Two months on us.",
    features: [
      { icon: Crown, text: "Everything in Summit" },
      { icon: Zap, text: "Save 32% vs. monthly" },
      { icon: Sparkles, text: "Founders perks & early features" },
    ],
    badge: "Best value",
  },
];

const INVOICES = [
  { id: "inv-2611", date: "2026-04-12", amount: 11.0, status: "Paid" },
  { id: "inv-2588", date: "2026-03-12", amount: 11.0, status: "Paid" },
  { id: "inv-2542", date: "2026-02-12", amount: 11.0, status: "Paid" },
  { id: "inv-2501", date: "2026-01-12", amount: 11.0, status: "Paid" },
];

const CURRENT_PLAN: PlanId = "summit";
const RENEWAL_DATE = "2026-06-12";
const PAYMENT = { brand: "Visa", last4: "4242", expMonth: 9, expYear: 2028 };
const TRIAL_DAYS_USED = 84;
const FEATURE_USAGE = [
  { label: "Segment efforts analyzed", used: 312, cap: null },
  { label: "Custom routes saved", used: 14, cap: null },
  { label: "Heart rate analyses", used: 47, cap: null },
];

type VariantId = "aside-card" | "inline-section" | "header-pill";

export default function BillingPlanPrototype() {
  const [variant, setVariant] = useState<VariantId>("aside-card");
  return (
    <>
      {variant === "aside-card" && <AsideCardVariant />}
      {variant === "inline-section" && <InlineSectionVariant />}
      {variant === "header-pill" && <HeaderPillVariant />}
      <VariantSwitcher current={variant} onChange={setVariant} />
    </>
  );
}

/* ===== Shared profile shell — mirrors /athlete/me ===== */

function ProfileShell({
  asideTop,
  inlineBlock,
  headerTrailing,
}: {
  asideTop?: React.ReactNode;
  inlineBlock?: React.ReactNode;
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
          {asideTop}
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

/* ===== Variant A: aside card with manage drawer ===== */

function AsideCardVariant() {
  const current = PLANS.find((p) => p.id === CURRENT_PLAN)!;
  const card = (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="bg-secondary text-secondary-foreground p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
            Current plan
          </span>
          <Badge className="bg-primary text-primary-foreground">{current.badge ?? "Active"}</Badge>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="font-display text-2xl font-bold tracking-tight">{current.name}</span>
        </div>
        <div className="mt-1 font-mono text-xs opacity-70">
          ${current.priceUsd.toFixed(0)}/mo · renews {fmtDate(RENEWAL_DATE)}
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-2 text-sm">
          {current.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span className="text-foreground/85">{f.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full" size="sm">
                Manage plan
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-3xl">
                <DrawerHeader>
                  <DrawerTitle>Manage plan & billing</DrawerTitle>
                </DrawerHeader>
                <BillingManageContent />
              </div>
            </DrawerContent>
          </Drawer>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3 w-3" /> {PAYMENT.brand} ····{PAYMENT.last4}
            </span>
            <span>Update</span>
          </div>
        </div>
      </div>
    </div>
  );

  return <ProfileShell asideTop={card} />;
}

/* ===== Variant B: inline plan & billing section ===== */

function InlineSectionVariant() {
  const current = PLANS.find((p) => p.id === CURRENT_PLAN)!;
  const usage = FEATURE_USAGE;

  const section = (
    <section className="mt-8 grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Plan & billing
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <Crown className="h-4 w-4 text-primary" />
              <h2 className="font-display text-2xl font-bold tracking-tight">{current.name}</h2>
              <span className="text-sm text-muted-foreground">${current.priceUsd}/mo</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Member for {TRIAL_DAYS_USED} days · renews {fmtDate(RENEWAL_DATE)} via {PAYMENT.brand}{" "}
              ····{PAYMENT.last4}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Change plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Choose your plan</DialogTitle>
                  <DialogDescription>
                    Switch any time. Yearly billing saves 32%.
                  </DialogDescription>
                </DialogHeader>
                <PlanGrid />
              </DialogContent>
            </Dialog>
            <CancelDialog />
          </div>
        </div>
        <Separator className="my-5" />
        <div className="grid grid-cols-3 gap-6">
          {usage.map((u) => (
            <div key={u.label}>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {u.label}
              </div>
              <div className="stat-num text-2xl mt-1">{u.used}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {u.cap ? `of ${u.cap}` : "Unlimited on Summit"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Recent invoices
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {INVOICES.slice(0, 4).map((inv) => (
            <li key={inv.id} className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {fmtDate(inv.date)}
              </span>
              <span>
                ${inv.amount.toFixed(2)}{" "}
                <span className="text-[color:var(--pr)] text-xs ml-1">{inv.status}</span>
              </span>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-xs text-foreground underline-offset-4 hover:underline"
        >
          All receipts <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </section>
  );

  return <ProfileShell inlineBlock={section} />;
}

/* ===== Variant C: header pill opens full-screen plan dialog ===== */

function HeaderPillVariant() {
  const current = PLANS.find((p) => p.id === CURRENT_PLAN)!;
  const pill = (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-primary/12 transition-colors">
          <Crown className="h-3.5 w-3.5 text-primary" />
          <span>{current.name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground font-mono">${current.priceUsd}/mo</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Plan & billing</DialogTitle>
          <DialogDescription>Manage your subscription, payment, and invoices.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="plan" className="mt-2">
          <TabsList>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="mt-4">
            <PlanGrid />
          </TabsContent>
          <TabsContent value="payment" className="mt-4">
            <PaymentPanel />
          </TabsContent>
          <TabsContent value="invoices" className="mt-4">
            <InvoiceList />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
  return <ProfileShell headerTrailing={pill} />;
}

/* ===== Reusable subcomponents ===== */

function BillingManageContent() {
  return (
    <div className="px-4 pb-8 space-y-6">
      <PlanGrid />
      <Separator />
      <PaymentPanel />
      <Separator />
      <InvoiceList />
      <Separator />
      <div className="flex justify-end">
        <CancelDialog />
      </div>
    </div>
  );
}

function PlanGrid() {
  const [yearly, setYearly] = useState(false);
  const [selected, setSelected] = useState<PlanId>(CURRENT_PLAN);
  const showing = yearly
    ? PLANS.filter((p) => p.id !== "summit")
    : PLANS.filter((p) => p.id !== "summit-yearly");
  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className={`text-xs ${yearly ? "text-muted-foreground" : "text-foreground"}`}>
          Monthly
        </span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={`text-xs ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly <span className="text-[color:var(--pr)] font-medium">–32%</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {showing.map((p) => {
          const active = selected === p.id;
          const isCurrent = p.id === CURRENT_PLAN;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`text-left rounded-xl border p-4 transition-all ${
                active ? "border-primary bg-primary/4 ring-2 ring-primary/20" : "border-border bg-surface hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-base font-semibold">{p.name}</div>
                {p.badge && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="stat-num text-2xl font-bold">${p.priceUsd}</span>
                <span className="text-xs text-muted-foreground">/{p.period}</span>
                {p.period === "year" && (
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    ${p.monthlyEquivalent.toFixed(2)}/mo equiv.
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.blurb}</p>
              <ul className="mt-3 space-y-1.5 text-xs">
                {p.features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <Icon className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>
              {isCurrent && (
                <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  Current plan
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm" disabled={selected === CURRENT_PLAN}>
          {selected === CURRENT_PLAN ? "Already on this plan" : "Switch & save"}
        </Button>
      </div>
    </div>
  );
}

function PaymentPanel() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-12 rounded-md bg-background border border-border grid place-items-center font-mono text-xs">
            VISA
          </div>
          <div>
            <div className="text-sm font-medium">
              Visa ····{PAYMENT.last4}
            </div>
            <div className="text-xs text-muted-foreground">
              Expires {PAYMENT.expMonth.toString().padStart(2, "0")}/{PAYMENT.expYear}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Update card
        </Button>
      </div>
    </div>
  );
}

function InvoiceList() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left font-medium px-4 py-2.5">Date</th>
            <th className="text-left font-medium px-4 py-2.5">Invoice</th>
            <th className="text-right font-medium px-4 py-2.5">Amount</th>
            <th className="text-right font-medium px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {INVOICES.map((inv) => (
            <tr key={inv.id} className="border-t border-border">
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                {fmtDate(inv.date)}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs">{inv.id.toUpperCase()}</td>
              <td className="px-4 py-2.5 text-right font-mono">${inv.amount.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-right text-[color:var(--pr)] text-xs font-medium">
                {inv.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CancelDialog() {
  const [cancelled, setCancelled] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Summit?</DialogTitle>
          <DialogDescription>
            {cancelled
              ? "Your plan ends on " + fmtDate(RENEWAL_DATE) + ". Until then, everything keeps working."
              : "You'll keep access until " + fmtDate(RENEWAL_DATE) + ", then drop to Stride Free."}
          </DialogDescription>
        </DialogHeader>
        {!cancelled ? (
          <div className="space-y-3 mt-2">
            <div className="rounded-md bg-surface-2 p-3 text-xs">
              <div className="font-medium text-foreground mb-1">You'll lose:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>· Heart rate zones & relative effort</li>
                <li>· Segment leaderboard rankings</li>
                <li>· Custom route export</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Keep Summit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCancelled(true)}
              >
                Cancel anyway
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[color:var(--pr)] flex items-center gap-2">
            <Check className="h-4 w-4" /> Cancellation scheduled.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
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
    { id: "aside-card", label: "Aside card" },
    { id: "inline-section", label: "Inline section" },
    { id: "header-pill", label: "Header pill" },
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
