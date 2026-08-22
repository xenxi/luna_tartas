# AGENTS.md

## Project invariants

- Static Astro site with strict TypeScript; `src/content/` is the editorial source. Never hardcode catalog content in components.
- Preserve `YAML -> source adapter -> catalog/domain -> presentation -> Astro/HTML` and centralize global configuration.
- Preserve existing URLs, SEO, public contracts, and architecture unless explicitly instructed otherwise.
- Require accessibility and progressive enhancement; use client JavaScript only for a demonstrated need.
- Never commit secrets or sensitive information.

## Context discipline

1. Read `AGENTS.md` and the current task.
2. Inspect directly affected source files.
3. Consult only authoritative documentation materially needed for the scope.
4. Use `docs/README.md` to locate additional contracts.

Never load documentation recursively, read all of `docs/` by default, or open files merely because they exist. `docs/archive/` is historical, not normal implementation context. Read `docs/archive/v1-roadmap.md` only for a V1 decision, old dependency, evidence, contract origin, or regression. Explicit task references override unrelated history.

## Execution flow

Work strictly one task at a time:

1. Execute only the requested task within its scope.
2. Do not start later tasks or incidental future work.
3. Run relevant checks and record the result.
4. Use the closeout below, stop, and await a new explicit request.

Never execute the next task even if obvious, unblocked, small, or directly dependent. Allow only extra work required for the current task. Do not anticipate milestones.

## Task closeout

```text
Task completed:
<identifier> — <title>

Status:
DONE | BLOCKED

Summary:
<brief summary>

Verification:
<checks and result>

Next task:
<identifier> — <title> | Not defined

Next task summary:
<brief objective> | Not applicable

Recommended model:
LUNA | SOL | SOL REVIEW

Reason:
<brief justification>

STOP — do not execute the next task.
```

Be compact; do not copy all evidence. If no next task exists, write `Not defined`; never invent one. A recommendation does not authorize execution.

## Model recommendation

- **LUNA**: mechanical, localized, repetitive, or tightly specified work.
- **SOL**: significant reasoning, research, design, architecture, domain, responsive, or multi-option work.
- **SOL REVIEW**: LUNA/SOL work needing independent higher-reasoning review, especially for visual fidelity, architecture, complex responsive behavior, accessibility, regressions, or milestone validation.

Use the smallest model appropriate for the task. Recommendations are informative; an explicit task model takes precedence.
