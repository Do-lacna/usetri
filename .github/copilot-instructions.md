# Copilot Instructions

This is a React Native/Expo app (Usetri) for grocery price comparison across Slovak supermarkets.

## Code Conventions

- **Component filenames**: kebab-case (e.g., `category-card.tsx`, `search-header.tsx`)
- **Screen filenames**: `*-screen.tsx` (e.g., `discounts-screen.tsx`)
- **Hook filenames**: `use-*` (e.g., `use-cart-actions.ts`)
- **Path alias**: use `~/` for project root imports (e.g., `~/src/components/...`)
- **Linter**: Biome (not ESLint) — single quotes, no arrow function parens for single params
- **Styling**: NativeWind (Tailwind CSS classes). Use semantic color tokens (`primary`, `secondary`, `destructive`, etc.) defined in `tailwind.config.js`, not raw hex values.
- **No inline styles** unless StyleSheet.create is required for React Native-specific properties.

## State Management

- **Server state**: TanStack React Query — use the auto-generated hooks from `src/network/query/query.ts`. Never fetch with raw axios outside of those hooks.
- **Local persistence**: MMKV via helpers in `src/persistence/`. Do not use AsyncStorage.
- **Auth/app state**: React Context from `src/context/`. Do not introduce Redux or Zustand.

## API Layer

- `src/network/query/query.ts` and `src/network/model/` are **auto-generated** — never edit them manually.
- After backend changes, regenerate with `npm run generate-fetcher`.

## Internationalization

- All user-facing strings must go through i18next (`useTranslation` hook). No hardcoded display strings.
- Default language is Slovak (`sk`).

## Feature Structure

New features go in `src/features/<feature-name>/` with a `components/` subfolder for feature-specific components. Shared/reusable components go in `src/components/`.
