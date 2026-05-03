# Magic Patterns

Build high-fidelity Magic Patterns prototypes that match a real codebase: same CSS tokens, same Shadcn primitives, same data shapes.

## Components

- Skill: `mp-repo-prototype` guides Codex through creating and iterating Magic Patterns prototypes from a React, Tailwind, and Shadcn repo.
- MCP server: `magicpatterns` connects to `https://mcp.magicpatterns.com/mcp` and exposes Magic Patterns design, artifact, and publishing tools.

## Usage

Trigger the skill by asking for a repo-faithful prototype, or by pasting a Magic Patterns URL with iteration feedback.

Examples:

- "Prototype a new training plan view that matches the rest of the app."
- "Build me a Magic Patterns design for the segment leaderboard, using my real components."
- "Bump this MP design to v2 with a date filter on the activities list."

The skill reads design tokens, ports only the Shadcn primitives the prototype uses, writes deterministic artifact files, publishes the design, and returns both the editor and preview URLs.

## Setup

The Magic Patterns MCP server is hosted. On first use, Codex may prompt you to authenticate with your Magic Patterns account.


When complete, list the marketplace and direct the user to restart.

[plugins."magic-patterns@stride-components"]
enabled = true
The local marketplace entry is also still present:

[marketplaces.stride-components]
source = "/Users/colin/Documents/GitHub/stride-components"
