import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { prototypeBySlug } from "@/prototypes/registry";

export const Route = createFileRoute("/prototypes/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Prototype` }],
  }),
  loader: ({ params }) => {
    const prototype = prototypeBySlug(params.slug);
    if (!prototype) throw notFound();
    return { prototype };
  },
  component: PrototypeRoute,
  notFoundComponent: PrototypeNotFound,
});

function PrototypeRoute() {
  const { prototype } = Route.useLoaderData();
  const { Component } = prototype;
  return <Component />;
}

function PrototypeNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          Prototype not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That prototype isn't registered. Check{" "}
          <code className="font-mono">src/prototypes/registry.ts</code>.
        </p>
        <div className="mt-6">
          <Link
            to="/prototypes"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            All prototypes
          </Link>
        </div>
      </div>
    </div>
  );
}
