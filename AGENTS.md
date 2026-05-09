# AGENTS.md

Shared working rules for AI coding agents in this repository.

This document is intentionally focused on implementation rules and workflow.  
For architecture and domain details, read `docs/ARCHITECTURE.md`.

## Document Map

- Shared agent rules (this file): `AGENTS.md`
- Architecture and domain reference: `docs/ARCHITECTURE.md`

## Scope and Priorities

When instructions conflict, follow this priority:

1. User request in the current chat
2. File-local constraints and code comments in touched files
3. This shared rules document (`AGENTS.md`)
4. Architecture and reference notes in `docs/ARCHITECTURE.md`

## Implementation Rules

- Keep the existing layered flow in feature modules: Repository -> Service -> Query -> Hook -> Component.
- Preserve user-scoped data behavior: include `firebase.auth.currentUser?.uid` in user-scoped query keys and logic.
- Keep type/schema single source of truth: infer TypeScript types from Zod schemas; do not duplicate shape definitions.
- Prefer existing utilities and patterns before introducing new abstractions (`ToolLayout`, dialog API, style helpers, Firebase utils).
- Minimize impact: change only files required for the task and avoid broad refactors unless explicitly requested.

## File and Naming Conventions

- Use path alias `@/` for source imports when consistent with nearby code.
- Follow existing query naming patterns:
  - `get[Feature][Purpose]QueryOptions`
  - `get[Feature][Purpose]MutationOptions`
- Keep feature folder structure consistent with existing modules under `src/features/`.
- Respect current formatting and lint rules (Prettier + ESLint zero warnings policy).

## Quality Checks Before Finishing

Run relevant checks for touched code:

- `yarn type` for type safety
- `yarn lint` for lint compliance
- `yarn build` when changes may affect build/runtime integration

If some checks are skipped, explicitly state what was not run and why.

## Change Communication

- Summarize what changed, why, and where (file paths).
- Mention trade-offs or assumptions when behavior-affecting decisions are made.
- Suggest concrete next actions only when useful (for example, run checks or validate a user flow).
