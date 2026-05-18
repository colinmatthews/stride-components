---
name: verify-spec
description: Use when the user wants to define verifiable completion criteria for a fuzzy task — writing, strategy, prioritization, design briefs, anything where they can recognize "done" but can't articulate why. Produces a project spec — a list of binary checks that each pass the "stranger test" — that gates whether an output ships. Do NOT use to score or grade existing outputs; this defines the bar, it does not apply it.
---

# verify-spec

Convert a fuzzy task into a set of binary completion checks that don't require the requester's judgment to apply. The output is a YAML spec at `.claude/specs/<task-slug>.yaml` containing 6+ admitted checks. The bar each check must clear is the **stranger test**: a person without the requester's context could apply it.

This is not a rubric. There is no scoring. Each check stands alone. An output ships iff all checks pass.

## The principle

> "Verification means you can check the output against a standard that doesn't require your full judgment to apply." — Karpathy

A check fails the stranger test if it uses words like *good*, *clear*, *appropriate*, *on-brand*, *feels right*, *sounds like me* — without further definition. Reject these or drill until they become structural.

Built on three findings the interview leans into:

- **Criteria drift** (Shankar et al., UIST '24) — users discover their tacit standards by reacting to outputs, not from a blank page. The interview must show examples.
- **Critique shadowing** (Hamel Husain) — pass/fail with a one-sentence "because…" exposes the implicit rule. Don't ask for criteria; ask for verdicts.
- **Spec before generation** (Karpathy) — the check list is the deliverable. Generation comes after.

## Interview procedure

Run in order. **One question per turn.** Never bundle. If the user gives a fuzzy answer, drill — do not move on.

### Step 1 — Frame the task

Ask:

> "What's the task you want to define a spec for? Describe it like it would be assigned to you, in one or two sentences."

Capture the task name as a slug (lowercase, hyphens) for the eventual spec file.

**Do not ask who the applier is.** The applier is fixed: a no-context stranger. That's the whole point of the stranger test, and it's the bar this skill enforces. Every admitted check has to be applicable by someone with zero context about the requester, their taste, or this conversation. If the user pushes back ("but I'll review it myself"), explain that the spec's leverage comes from being usable *without* them — for pre-flight LLM checks, generation constraints, future delegation, or consistency over time. The stranger is the bar regardless of who happens to read the output later.

State the bar back to the user in one line, then move directly to Step 2:

> "Every check we write has to be applicable by someone with zero context about you. That's fixed. Now let's surface what you actually look for."

### Step 2 — Collect examples

Ask:

> "Paste 2 outputs you'd ship as-is, and 2 you'd reject. If you don't have any on hand, say so and I'll generate 3 drafts for you to react to."

If the user has none, generate 3 candidate drafts inline and present them for pass/fail. **Do not skip this step.** Without examples, the user can't surface their tacit standards — that's the criteria-drift finding. Skipping straight to "what are your criteria?" produces a generic, useless spec.

### Step 3 — Critique-shadow each example

For each example, ask only:

> "Pass or fail? And in one sentence, **because…**?"

Capture both. The "because…" is the seed of a candidate check.

If the user says "it's just bad" or "it doesn't feel right" or "it's off," do not let it stand. Push back with:

> "What specifically would you point at? Could a stranger spot the same thing without your context?"

Repeat until the answer names something concrete (a missing element, a wrong word, a structural issue).

### Step 4 — Extract candidate checks

For each "because…" critique, draft a candidate check phrased as a binary question or structural assertion. Show it back:

> "Does this capture what you meant? — *<draft check>*"

If the user confirms, run the **stranger test**:

1. Spawn the `stranger-test` agent via the Agent tool with `subagent_type: "stranger-test"`.
2. **Do not tell the agent the user's verdict on the sample.** Send only the candidate check and the sample, framed neutrally. Phrasing like *"this output was rejected"* or *"this should fail"* biases the agent's independent application — both its applicability judgment and its applied result. The whole point of the stranger test is whether a no-context reader reaches the same verdict on their own.
3. The agent returns:
   - `verdict: applicable | needs_more_context`
   - If `applicable`: also `applied_to_sample: pass | fail` (the agent's independent verdict)
4. Compare the agent's result to the user's verdict on the same sample:
   - `applicable` AND agent's pass/fail **matches** the user's → **admit the check**.
   - `applicable` BUT agent's pass/fail **mismatches** the user's → the check is well-defined for a stranger, but it's pointing at the wrong property. Show the user the mismatch and ask them to refine (or drop the check).
   - `needs_more_context` → relay the agent's `missing_context` back to the user. Ask them to refine. If they can't make it concrete, drop the check.

Tag admitted checks with type:
- `structural` (deterministic — length, pronoun usage, section count)
- `reference` (verifiable by lookup — N citations, link to X, mentions person Y)
- `binary_llm` (yes/no question a small model can answer reliably)

### Step 5 — Stress-test on a held-out example

Once 6+ checks are admitted, ask the user for a fresh example (or generate one) and walk all checks against it together.

- Check fires but shouldn't → tighten the wording.
- Check should fire but doesn't → drop it (it isn't capturing the rule) or split into two narrower checks.
- Two checks always agree → merge them.

### Step 6 — Write the spec

Write to `.claude/specs/<task-slug>.yaml`. Slug the task name (lowercase, hyphens). Format:

```yaml
task: "Weekly product update"
calibration_target: "no-context stranger (fixed by skill)"
created: 2026-05-04
checks:
  - id: pronoun_we
    type: structural
    statement: "Document uses 'we' as the primary subject pronoun, not 'I'."
    rationale: "User flagged 'I'-heavy drafts as off-brand."

  - id: cites_3_metrics
    type: reference
    statement: "Document references at least 3 PostHog metrics by name."
    rationale: "User rejected drafts without quantitative grounding."

  - id: states_next_week
    type: binary_llm
    statement: "Document states at least one specific commitment for next week, with a named owner."
    rationale: "User flagged drafts that summarized without committing forward."
```

Then tell the user the path and what they can do with it next (load into a grader skill, run as a CI check, hand to a junior teammate as instructions).

## Hard rules this skill enforces

- A check is admitted only if the `stranger-test` agent says `applicable`.
- No scaled scores. No 1–5. No "quality." Binary only.
- "Sounds like me," "is good," "feels right" are never admitted as checks.
- Will not finish with fewer than 6 admitted checks. If the interview stalls below 6, the user is being too vague — drill.
- The skill never applies the spec it just produced. That's a different skill's job.

## When to use vs not

Use when:
- Task is recurring (briefs, prioritization writeups, design specs, post-meeting notes).
- User notices they reject outputs but can't articulate why.
- Output will be generated by an LLM or junior teammate and needs gating before it ships.

Don't use when:
- The task already has obvious deterministic checks (just write them — no interview needed).
- The output is a one-off that won't repeat.
- The user wants a quality score, not a completion gate (different problem — that's a judge skill).
