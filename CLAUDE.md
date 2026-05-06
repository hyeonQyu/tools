# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server
yarn build        # Type-check + Vite build
yarn type         # Type-check only (tsc --noEmit)
yarn lint         # ESLint (zero-warnings policy)
yarn lint:fix     # ESLint with auto-fix
```

No test runner is configured.

## Architecture

This is a personal finance PWA with two tools: **Budgeting** (`/tool/budgeting`) and **Goals Tracking** (`/tool/goals-tracking`). It uses anonymous Firebase authentication — each browser session gets a persistent anonymous UID, and all Firestore documents are keyed by that UID.

### Feature Module Structure

Each feature in `src/features/` follows an identical layered structure:

```
features/<name>/
  components/   # UI components
  data/
    repositories/   # Firestore CRUD
    services/       # Business logic
    <name>.container.ts  # Wires dependencies
  hooks/        # Feature hooks
  queries/      # React Query options
  stores/       # Zustand stores
  types/        # Zod schemas + inferred types
  utils/
  index.ts      # Barrel export
```

### Data Flow

**Repository → Service → Query → Hook → Component**

Repositories are created with `getFirebaseRepositoryCreator(collectionName)` from `src/firebase/repositories.utils.ts`. They access `firebase.auth.currentUser.uid` at call time (not creation time) to scope data per user.

Services are created with `getServiceCreator()` from `src/firebase/service.utils.ts`, receiving repositories as injected dependencies. They are wired together in `*.container.ts`.

React Query query options live in `queries/`, named `get[Feature][Purpose]QueryOptions()`. They return `{ queryKey, queryFn }`. The `queryKey` must include `firebase.auth.currentUser?.uid` when the query is user-scoped, so React Query invalidates cache on user change.

Hooks use `useSuspenseQuery()` for data loading — the calling component must be wrapped in `<Suspense>`. After loading, they populate Zustand stores via `reset()`. An `isLoadedRef` prevents re-initialization on background refetches.

### State Management

Two-layer model:
- **Zustand stores** hold the live editing state (form values, config). Components read from and write to stores directly.
- **React Query** handles fetch/cache lifecycle. After initial load, stores are the source of truth.

Auto-save hooks (`useBudgetingAutoSave`, etc.) watch Zustand stores, debounce writes (1.5s), and compare with loaded data using deep equality before saving.

### Routing

Uses `@hyeonqyu/typed-router-react`. The route tree is defined in `src/routes/routes.config.tsx` with typed metadata (name, icon, component). Routes are generated dynamically — to add a new tool, add an entry to the route tree and a new page + feature folder.

### Provider Hierarchy (`src/main.tsx`)

From outermost to innermost:
`DateLocalizationProvider` → `AppRoutesProvider` → `BrowserRouter` → `ReactQueryClientProvider` → `ThemeProvider` → `FirebaseAuthProvider` → `IndexedDBProvider` → `DialogProvider` → `App`

`FirebaseAuthProvider` renders `null` until anonymous auth is confirmed. This guarantees `auth.currentUser` is non-null for all children, including React Query `queryFn` calls.

### Page Layout Pattern

All tool pages use the `ToolLayout` compound component:

```tsx
<ToolLayout>
  <ToolLayout.Header>
    <ToolLayout.Row justifyContent="space-between" alignItems="center">
      <ToolLayout.Title />          {/* pulls name from route metadata */}
      <FeatureConfigButton />
    </ToolLayout.Row>
    <FeatureSummary />
  </ToolLayout.Header>

  <ToolLayout.Body>
    <Suspense fallback={<FeatureBodySkeleton />}>
      <FeatureBody />               {/* contains useSuspenseQuery hooks */}
    </Suspense>
  </ToolLayout.Body>
</ToolLayout>
```

## Key Conventions

- **Path alias**: `@/` maps to `src/`
- **Formatting**: Prettier with 140-char line width, single quotes, trailing commas, organized imports
- **Commit messages**: prefixed `[TOOL-##]` matching Linear tickets
- **`DocumentEntity<T>`**: all Firestore documents have `id`, `createdAt`, `updatedAt` fields; `serializeEntity()` deserializes Firestore timestamps to JS `Date`
- **`generateRandomKey(prefix?)`** in `src/lib/random.utils.ts`: used for stable unique IDs on list items
- **`TIME_UNIT`** in `src/lib/time.defines.ts`: provides readable time constant chains (e.g., `TIME_UNIT.unitOfMs.asSecond`)

## Environment

Copy `.env.example` to `.env` and fill in Firebase project credentials. All env vars are `VITE_FIREBASE_*`.
