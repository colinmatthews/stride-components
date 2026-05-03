# Magic Patterns

Build high-fidelity Magic Patterns prototypes that match your real codebase — same CSS tokens, same Shadcn primitives, same data shapes — without running the repo locally.

## Components

- **Skill: `mp-repo-prototype`** — guides Claude through creating a Magic Patterns design from your repo, then iterating on it across versions as stakeholders give feedback. Activates when you mention prototyping a feature, want something testable with users, ask Claude to "match my app" or "use my components", or paste an MP URL with feedback.
- **MCP server: `magic-patterns`** — connects to `https://mcp.magicpatterns.com/mcp` and exposes the Magic Patterns design tools (`create_design`, `get_design_status`, `read_artifact_files`, `write_artifact_files`, `publish_artifact`, `send_prompt`, `create_new_artifact`, `get_editor_id_from_url`, etc.) so the skill can drive end-to-end prototype creation and iteration.

## Setup

The Magic Patterns MCP server is hosted, so no local install is needed. On first use you'll be prompted to authenticate with your Magic Patterns account.

## Usage

Trigger the skill by mentioning what you want to prototype. Examples:

- "Prototype a new training plan view that matches the rest of the app."
- "Build me a Magic Patterns design for the segment leaderboard, using my real components."
- "Bump this MP design to v2 with a date filter on the activities list." (paste the MP URL)

The skill will read your design tokens, port the Shadcn primitives you actually use, generate the design via the Magic Patterns MCP server, and share back both an Editor URL (for further iteration) and a Preview URL (for sharing with testers).

## Notes

- The skill expects a React + Tailwind + Shadcn codebase (looks for `components.json` and `src/components/ui/`).
- It will generate or read a `DESIGN.md` at the repo root on the first run — review the brand-voice prose sections, since those are best-effort drafts.
- Prototypes are intentionally not wired to a real backend, auth, or analytics — the skill states what's out of scope on every handoff.
