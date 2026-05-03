# Stride Components

A frontend-only prototype starter for the Stride UI. No backend, no database —
every screen renders from mock data that lives in `src/lib/mock-data.ts`.

Use this repo to prototype new screens, iterate on components, or run quick
user-testing sessions without standing up any services.

## What's in the box

- Vite + React 19 + TypeScript
- TanStack Router (file-based routes in `src/routes/`)
- Tailwind CSS v4
- The full Stride shadcn/ui component library under `src/components/ui/`
- App components (`ActivityCard`, `AppShell`, `RouteMap`, `SportBadge`, `Stat`)
- Deterministic mock data shaped exactly like the backend's bootstrap payload

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Build a static bundle:

```bash
npm run build
npm run preview
```

## Where to edit things

| Task                         | File                                     |
| ---------------------------- | ---------------------------------------- |
| Change the signed-in user    | `src/lib/mock-data.ts` → `SEED_ME`       |
| Add athletes / activities    | `src/lib/mock-data.ts` → `SEED_*` arrays |
| Add / tweak a page           | `src/routes/*.tsx`                       |
| Tweak shared UI              | `src/components/`                        |
| Shadcn primitives            | `src/components/ui/`                     |
| Tailwind tokens              | `src/styles.css`                         |

The "API" (`src/lib/api.ts`) exposes the same functions the full app uses
(`toggleActivityKudo`, `saveActivity`, `toggleClubJoin`, etc.) but mutates the
in-memory mock arrays instead of calling a server. Reloads reset state — that's
intentional for prototyping.

## Data model

The mock data mirrors the real backend shape so prototypes stay compatible with
the production app:

- `Athlete`, `Activity`, `Segment`, `Club`, `Challenge` — see `src/lib/mock-data.ts`
- `AppData` is what a real backend would return from `/api/bootstrap`

## Install the Magic Patterns plugin (Claude Code)

This repo doubles as a Claude Code plugin marketplace. The `magic-patterns`
plugin (under `plugins/claude-magic-patterns/`) ships a skill that drives the
Magic Patterns MCP to build prototypes that match this codebase's tokens and
Shadcn primitives.

From inside Claude Code:

```
/plugin marketplace add colinmatthews/stride-components
/plugin install magic-patterns@stride-components
```

Or, if you've already cloned the repo locally:

```
/plugin marketplace add ./
/plugin install magic-patterns@stride-components
```

On first use you'll be prompted to authenticate with your Magic Patterns
account. See `plugins/claude-magic-patterns/README.md` for usage examples.
