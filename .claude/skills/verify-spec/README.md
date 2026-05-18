# verify-spec

A skill + agent for converting fuzzy tasks (writing, strategy, prioritization, design briefs) into a list of binary completion checks that each pass the **stranger test**: a person without your context can apply them.

The output is a project spec — a check list, not a scoring rubric. Generation comes after.

## Files

```
.claude/
├── skills/verify-spec/
│   ├── SKILL.md         ← the interview procedure
│   └── README.md        ← this file
├── agents/
│   └── stranger-test.md ← companion agent that verifies check admissibility
└── specs/               ← output dir, created on first run
```

## Use

```
/verify-spec
```

Conducts a 6-step interview, writes the spec to `.claude/specs/<task-slug>.yaml`. Plan ~15–25 turns for a real task — most of it is the model pushing back on fuzzy criteria until you produce concrete ones.

## Move to another repo

The skill and agent are project-scoped and use only relative paths. To migrate:

1. Copy `.claude/skills/verify-spec/`
2. Copy `.claude/agents/stranger-test.md`
3. (Optional) Copy `.claude/specs/` if you want to keep existing specs

That's it. No config to update.

## Why this is two pieces, not one

The interview is conversational and shares context with the parent session — that's a skill. The stranger-test step is invalidated if it sees the conversation, because the whole point is to simulate someone without context. So that piece runs as an isolated agent. The skill calls it explicitly via `Agent(subagent_type: "stranger-test", ...)` — no auto-trigger.

If the agent ever gets pulled in by a different skill or auto-trigger, tighten its `description` field.

## Background

The methodology synthesizes three sources:

- **Karpathy** — *"Verification means checking against a standard that doesn't require your full judgment to apply."* Spec exists before generation; the check list IS the deliverable.
- **Hamel Husain** — binary pass/fail beats scaled rubrics; criteria emerge through critique-shadowing (force pass/fail + a "because…" sentence on real examples).
- **Shankar et al. (EvalGen, UIST '24)** — *criteria drift*: users discover their tacit standards by reacting to outputs, not from a blank page. The interview must show examples.

The stranger test is the unique constraint this skill adds on top of those — it's what filters tacit-standards-as-articulated into checks-anyone-can-apply.

## What this skill is not

- Not a judge. It defines the bar; it does not apply it.
- Not a scorer. There are no 1–5 scales, no weights, no aggregation. An output ships iff all checks pass.
- Not a one-shot. The interview takes time. Six admitted checks is the floor.
