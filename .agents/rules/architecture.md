# Architecture Guide

Cross-agent architecture reference for this repository.

## Product Context

- Personal finance PWA with four tools:
  - Budgeting: `/tool/budgeting`
  - Goals Tracking: `/tool/goals-tracking`
  - Fuel Payment: `/tool/fuel-payment`
  - Expiration Dates: `/tool/expiration-dates`
- Firebase anonymous auth is required before app children render.
- Firestore documents are scoped by `firebase.auth.currentUser.uid`.

## Feature Module Structure

Features live under `src/features/`: `budgeting`, `goals-tracking`, `fuel-payment`, `expiration-dates`, `user`.

Each feature follows:

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

React Query client defaults: `retry: false`, `staleTime: 0`.

## Persistence Model

1. Firestore: canonical per-user data.
2. IndexedDB (`src/indexed-db/`): local draft/cache, currently used by budgeting.

Rules:

- Reuse feature `types` Zod schemas in `INDEXED_DB_CONFIG`.
- Do not duplicate schema/type definitions.

### IndexedDB Store API

`useIndexedDBStore(storeName)` returns `null` while the DB initializes, then a typed `StoreAPI<T>` with:

- Basic CRUD: `add`, `get`, `getAll`, `update`, `delete`, `clear`, `count`, `exists`
- Index queries: `findByIndex`, `getAllByIndex`
- Bulk: `bulkAdd`, `bulkUpdate`, `bulkDelete`
- Pagination: `getPaginated`, `getPaginatedByIndex` — returns `{ data, total, hasMore }`
- Iteration: `forEach`, `find`, `filter`, `getRange`

All write operations (`add`, `update`, `bulkAdd`, `bulkUpdate`) run automatic Zod validation.
DB management utilities: `deleteIndexedDB`, `listIndexedDBs` (from `@/indexed-db`).

## Routing and Composition

- Typed routing with `@hyeonqyu/typed-router-react` and route metadata in `src/routes/routes.config.tsx`.
- Each route node carries `_metadata: { name, icon: { outlined, filled }, component }`.
- `BottomNavigation` (`src/routes/BottomNavigation.tsx`) is fixed at the bottom; uses `BOTTOM_NAVIGATION_HEIGHT = 82` and `Z_INDEX.bottomNavigation = 1000`.
- `useBottomNavigation()` derives the active tab index from `pathname`.
- Provider order in `src/main.tsx`:
  `DateLocalizationProvider -> AppRoutesProvider -> BrowserRouter -> ReactQueryClientProvider -> ThemeProvider -> FirebaseAuthProvider -> IndexedDBProvider -> DialogProvider -> App`
- `FirebaseAuthProvider` blocks rendering until auth is ready; signs in anonymously if no session exists.

`DateLocalizationProvider` configures dayjs with Korean locale, date format `YYYY.MM.DD`.

## Page Pattern

Use `ToolLayout` compound structure for tool pages (max-width 900px):

```tsx
<ToolLayout>
  <ToolLayout.Header>
    <ToolLayout.Row>
      <ToolLayout.Title />
      <ConfigButton />
    </ToolLayout.Row>
    <Summary />
  </ToolLayout.Header>
  <ToolLayout.Body>
    {' '}
    {/* scrollable flex Stack */}
    <Suspense fallback={<Skeleton />}>
      <FeatureBody />
    </Suspense>
  </ToolLayout.Body>
</ToolLayout>
```

`Layout` (`src/components/Layout`) wraps pages with `BottomNavigation` fixed at the bottom.

## Shared Components

All in `src/components/`:

- `ToolLayout` — compound component (Header, Row, Title, Body), max-width 900px
- `Layout` — page wrapper with fixed `BottomNavigation`, accounts for `BOTTOM_NAVIGATION_HEIGHT`
- `SlideTabViews<T>` — animated tab content switcher (Framer Motion)
- `SortableItem` — drag-and-drop item wrapper using `@dnd-kit/sortable`
- `ColorSelector` — grid of clickable color boxes with checkmark on selected
- `SlideUpTransition` — `forwardRef` Slide component for dialog enter transitions

## Shared Hooks

- `useAutoTimeoutFocus(ref)` — calls `.focus()` after a 100 ms timeout; used in auto-focused inputs
- `useThemeMode()` — returns `{ mode: 'light' | 'dark', setMode }` from ThemeProvider context

## Dialog API

`useDialog()` returns three imperative methods:

| Method             | Returns              | Notes                                                            |
| ------------------ | -------------------- | ---------------------------------------------------------------- |
| `open<T>(options)` | `Promise<T \| null>` | `content` is `Resolvable<(close) => ReactNode>`                  |
| `alert(options)`   | `Promise<void>`      | `content` is plain `ReactNode`; auto-adds confirm button         |
| `confirm(options)` | `Promise<boolean>`   | `content` is plain `ReactNode`; auto-adds cancel/confirm buttons |

Common options: `title`, `disableBackdropClick`, `disableEscapeKeyDown`, full MUI `DialogProps` subset, `slots.transition` (e.g. `SlideUpTransition`).

## Shared Utilities

### Style (`src/styles/`)

- `pxToRem(px)` — converts px to rem using `--base-font-size` CSS variable (default 16 px)
- `enqueueClosableSnackbar(options)` — Notistack wrapper; 3 s default, bottom-center, close icon
- `useThemeMode()` — light/dark mode hook
- `Z_INDEX` — `{ bottomNavigation: 1000, dialog: 1100 }` (snackbar: 1400)
- `ThemeProvider` — MUI theme with custom typography (Pretendard), light/dark palettes, component overrides, `theme.heights: { sm, md, lg }` in rem

### Lib (`src/lib/`)

- `r(resolvable)` — converts `Resolvable<T>` (value or `() => T`) to a callable function
- `generateRandomKey(prefix?)` — timestamp + random suffix for stable item IDs
- `formatAmount(amount)` — formats Korean Won with 억/만 units (e.g. `1억 2만 3원`)
- `parseInputWithUnit(input, unit)` — multiplies input by `BudgetingUnit` value
- `TIME_UNIT` — conversion table: `TIME_UNIT.unitOfMs.asSecond === 1000`, etc.
- `FIRST_MONTH = 0`, `LAST_MONTH = 11`, `DAYS = ['일','월','화','수','목','금','토']`

### KST Date Utilities (`src/lib/time.utils.ts`)

All date logic uses KST (+09:00) — never rely on local system timezone:

- `getKstDateParts(date)` — `{ year, month, day }` in KST
- `toKstDateKey(date)` — `'YYYY-MM-DD'` string in KST
- `toKstMidnightDate(date)` — KST midnight as a UTC `Date`
- `getKstNow()` — current KST midnight

### Custom Error Classes (`src/lib/errors.ts`)

Used in the service and IndexedDB layers:

`NotFoundError`, `ConstraintError`, `QuotaExceededError`, `VersionError`, `AbortError`, `DataError`, `InvalidStateError`, `TimeoutError`

## Firebase Utilities (`src/firebase/`)

- `firebase.db` — Firestore instance; `firebase.auth` — Auth instance
- `getFirebaseRepositoryCreator(collectionName)` — returns a factory; UID is read at call time, not at creation time
- `serializeEntity(data)` — recursively converts Firestore `Timestamp` to `Date`
- `getServiceCreator()` — simple HOF for wiring service dependencies
- `DocumentEntity<T>` = `{ id, createdAt, updatedAt } & T`

## Conventions

- Import alias: `@/` -> `src/`
- Types are inferred from Zod: `z.infer<typeof schema>`
- Firestore entity shape: `DocumentEntity<T>` + `serializeEntity()`
- Use `generateRandomKey(prefix?)` for stable item IDs where needed
- Time constants: `TIME_UNIT`, `FIRST_MONTH`, `LAST_MONTH`, `DAYS`
- All date handling must use KST utilities from `src/lib/time.utils.ts`
