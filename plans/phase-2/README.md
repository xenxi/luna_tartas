# Phase 2

Status: ITERATIVE MANUAL WORKBENCH

V1 is closed. Its history is recorded in `docs/archive/v1-roadmap.md`.

Phase 2 is focused primarily on visual refinement. It is manually driven: the
user selects work iteratively, one view and one task at a time. There is no
predefined roadmap, execution order, or automatic progression between views.
Codex must not infer, invent, or start the next task. The user decides when a
new task starts and what it covers.

## View migration model

An existing view is normally migrated through two independent tasks:

- Desktop
- Mobile

Mobile is not an automatic continuation of Desktop. Desktop and Mobile may use
independent visual references and different compositions. Completing or
approving Desktop does not authorize starting Mobile; the user decides whether
and when to create that task. The same rule applies before moving to another
view.

## Visual task cycle

```text
Select view manually
-> analyze CURRENT vs TARGET outside Codex
-> create one Codex task
-> implement
-> run automated regression checks
-> AWAITING_VISUAL_APPROVAL
-> manual visual review
-> iterate on the same task if needed
-> DONE only after explicit user approval
-> STOP; the user decides what happens next
```

If manual review identifies differences, work continues on the same task. Do
not create `fix 1`, `fix 2`, or `visual correction 3` subtasks unless there is a
real scope boundary that justifies separating the work.

## Visual task states

- `PENDING`: the task is defined but has not started.
- `IN_PROGRESS`: Codex is implementing the task.
- `AWAITING_VISUAL_APPROVAL`: implementation and automated checks are complete,
  but manual visual review is still pending.
- `DONE`: all required checks pass and the user has explicitly approved the
  visual result.
- `BLOCKED`: a real impediment prevents completion of the task.

Finishing implementation does not finish a visual task. A technically passing
task remains `AWAITING_VISUAL_APPROVAL` until the user explicitly approves it.

## Quality gates

Visual tasks have two separate gates.

### Automated regression gate

This gate detects technical regressions. Depending on scope, it may include
lint, typecheck, tests, build, and tests specific to the affected view. These
checks cannot establish visual fidelity by themselves. An automated `PASS`
does not change a visual task to `DONE`.

### Manual visual gate

This gate compares the implementation with the approved reference. Review may
cover composition, proportions, spacing, typography, photography, crop,
ornamentation, responsive behavior, visual continuity, and other relevant
reference details.

Only explicit user approval authorizes this transition:

```text
AWAITING_VISUAL_APPROVAL -> DONE
```

## Known future work

The following items are known but are not scheduled milestones and have no
defined execution order:

### Sobre Luna

This new view is expected to follow the normal visual workflow: Desktop,
manual approval, Mobile, manual approval. Each platform remains an independent
task started only when the user requests it.

### Buscador general

This is a new functional feature and requires functional discovery before any
visual specification. Its architecture, ranking, algorithm, concrete UX,
schema, JavaScript, navigation, and design are intentionally undefined.

## Operating principle

```text
User selects view
-> ChatGPT defines exact visual changes
-> Codex implements one task
-> automated regression checks
-> manual visual approval
-> iterate on the same task if needed
-> user decides what happens next
```

Phase 2 is an iterative workbench, not a closed roadmap. Codex is not
responsible for deciding the visual roadmap.
