import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPrototype() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setDone(true);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <a href="/prototypes" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-sm bg-secondary font-display text-base font-bold text-secondary-foreground">
              S
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold tracking-tight">Stride</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Prototype · Login
              </div>
            </div>
          </a>
          <a
            href="/prototypes"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Prototypes
          </a>
        </header>

        <main className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_1fr]">
          <section className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Welcome back
              </span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Pick up <em className="not-italic text-primary">where you left off.</em>
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Your training history, segments, and clubs are right where you left them. Sign in to
              jump back in.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <Stat value="280K+" label="Athletes" />
              <Stat value="14.2M" label="km / month" />
              <Stat value="96K" label="Segments" />
            </dl>
          </section>

          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-8">
              {done ? (
                <SignedIn email={email} onReset={() => setDone(false)} />
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">Sign in</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use your Stride account to continue.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Button type="button" variant="outline" className="h-10 justify-center gap-2">
                      <GithubMark className="h-4 w-4" />
                      Continue with GitHub
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      or with email
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        autoComplete="email"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        autoComplete="current-password"
                        className="h-11 pl-9 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={remember}
                      onCheckedChange={(v) => setRemember(v === true)}
                    />
                    Remember me on this device
                  </label>

                  {error && (
                    <p
                      role="alert"
                      className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={busy} className="group h-11 w-full gap-2">
                    {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Sign in
                    {!busy && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    New to Stride?{" "}
                    <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
                      Create an account
                    </a>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </main>

        <footer className="flex items-center justify-between border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Stride</span>
          <span>Prototype · Not a real auth flow</span>
        </footer>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="stat-num mt-1 text-2xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.38-3.87-1.38-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.97 10.97 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5 12.02C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function SignedIn({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <ArrowRight className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">You're in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, <span className="text-foreground">{email}</span>. This is a prototype, so
          there's nowhere to go next.
        </p>
      </div>
      <Button variant="outline" onClick={onReset} className="h-10">
        Sign in again
      </Button>
    </div>
  );
}
