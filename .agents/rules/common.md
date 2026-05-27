# Common Implementation Rules

Cross-cutting implementation rules and conventions for this repository.

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
- All hooks must be declared as `export const` arrow functions, not `export function`:

  ```ts
  // correct
  export const useMyHook = () => { ... };

  // incorrect
  export function useMyHook() { ... }
  ```
