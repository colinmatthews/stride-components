# Prototypes

Sandbox for one-off screens. Each prototype lives in its own folder under
`src/prototypes/<name>/` and is fully isolated from the production routes
under `src/routes/` and the shared components under `src/components/`.

Prototypes **may** import from:

- `@/components/ui/*` — shared shadcn primitives (read-only)
- `@/components/*` — shared app components (read-only)
- `@/lib/*` — shared helpers, mock data, API stub
- `lucide-react`, `react`, etc.

Prototypes **must not** modify any file outside `src/prototypes/`. If you
need to change a shared component for a prototype, copy it into your
prototype folder and edit there.

## Add a new prototype

1. `mkdir src/prototypes/<slug>` and add `index.tsx` that
   `export default`s the page component.
2. Open `src/prototypes/registry.ts` and append an entry:
   ```ts
   { slug: "<slug>", title: "...", description: "...", Component: <Slug>Prototype }
   ```
3. Visit `http://localhost:5173/prototypes` for the index, or
   `/prototypes/<slug>` to jump straight in.

## Remove a prototype

Delete the folder and the matching line in `registry.ts`. Nothing else
depends on it.
