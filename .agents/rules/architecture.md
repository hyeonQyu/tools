# Architecture Guide

Cross-agent architecture reference for this repository.

## Product Context

- Personal finance PWA with two tools:
  - Budgeting: `/tool/budgeting`
  - Goals Tracking: `/tool/goals-tracking`
- Firebase anonymous auth is required before app children render.
- Firestore documents are scoped by `firebase.auth.currentUser.uid`.

## Feature Module Structure

Each feature under `src/features/` follows:

```text
features/<name>/
  components/
  data/
    repositories/
    services/
    <name>.container.ts
  hooks/
  queries/
  stores/
  types/
  utils/
  index.ts
```

## Data and State Flow

- Primary flow: Repository -> Service -> Query -> Hook -> Component.
- Repositories come from `getFirebaseRepositoryCreator(collectionName)` and must read UID at call time.
- Services come from `getServiceCreator()` and are wired in `*.container.ts`.
- React Query options live in `queries/`:
  - `get[Feature][Purpose]QueryOptions()` -> `{ queryKey, queryFn }`
  - `get[Feature][Purpose]MutationOptions()` -> `{ mutationKey, mutationFn }`
- User-scoped `queryKey` must include `firebase.auth.currentUser?.uid`.
- Data loading hooks use `useSuspenseQuery()` and hydrate Zustand via `reset()` once (`isLoadedRef` guard).

## Persistence Model

1. Firestore: canonical per-user data.
2. IndexedDB (`src/indexed-db/`): local draft/cache, currently used by budgeting.

Rules:
- Reuse feature `types` Zod schemas in `INDEXED_DB_CONFIG`.
- Do not duplicate schema/type definitions.

## Routing and Composition

- Typed routing with `@hyeonqyu/typed-router-react` and route metadata in `src/routes/routes.config.tsx`.
- Provider order in `src/main.tsx`:
  `DateLocalizationProvider -> AppRoutesProvider -> BrowserRouter -> ReactQueryClientProvider -> ThemeProvider -> FirebaseAuthProvider -> IndexedDBProvider -> DialogProvider -> App`
- `FirebaseAuthProvider` blocks rendering until auth is ready.

## Page Pattern

Use `ToolLayout` compound structure for tool pages:
- `ToolLayout.Header` with title/config/summary
- `ToolLayout.Body` with `<Suspense>` wrapped feature body

## Shared Utilities

- Dialog API (`src/dialog/`): imperative `confirm()` / `open()`.
- Style helpers (`src/styles/`): `pxToRem`, `enqueueClosableSnackbar`, `useThemeMode`, `theme.heights`.
- Resolvable utility (`src/lib/resolvable.utils.ts`): `r(resolvable)`.

## Conventions

- Import alias: `@/` -> `src/`
- Types are inferred from Zod: `z.infer<typeof schema>`
- Firestore entity shape: `DocumentEntity<T>` + `serializeEntity()`
- Use `generateRandomKey(prefix?)` for stable item IDs where needed
- Time constants: `TIME_UNIT`
