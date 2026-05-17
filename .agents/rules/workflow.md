# Workflow and Quality Checks

## Commands

```bash
yarn dev          # Start dev server
yarn build        # Type-check + Vite build
yarn type         # Type-check only (tsc --noEmit)
yarn lint         # ESLint (zero-warnings policy)
yarn lint:fix     # ESLint with auto-fix
```

No test runner is configured.

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
