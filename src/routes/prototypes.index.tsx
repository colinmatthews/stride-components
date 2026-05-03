import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { prototypes } from "@/prototypes/registry";

export const Route = createFileRoute("/prototypes/")({
  head: () => ({
    meta: [
      { title: "Prototypes — Stride" },
      { name: "description", content: "Sandbox prototypes built on Stride components." },
    ],
  }),
  component: PrototypesIndex,
});

function PrototypesIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-foreground/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Sandbox
          </span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Prototypes
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          One-off screens built on Stride's shared components. Each lives in
          its own folder under <code className="font-mono text-sm">src/prototypes/</code> and
          can't touch the production routes or shared UI.
        </p>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {prototypes.map((p) => (
            <li key={p.slug}>
              <Link
                to="/prototypes/$slug"
                params={{ slug: p.slug }}
                className="group flex items-center justify-between gap-6 py-5 transition-colors hover:bg-muted/40"
              >
                <div>
                  <div className="font-display text-xl font-semibold tracking-tight">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{p.description}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    /prototypes/{p.slug}
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        {prototypes.length === 0 && (
          <p className="mt-12 rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            No prototypes yet. See <code className="font-mono">src/prototypes/README.md</code>.
          </p>
        )}
      </div>
    </div>
  );
}
