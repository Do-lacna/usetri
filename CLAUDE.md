# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start              # Start Expo dev server (clears cache)
npm run ios                # Build and run on iOS simulator
npm run android            # Build and run on Android emulator
npm run lint               # Lint and auto-fix with Biome
npm run format             # Format code with Biome
npm run generate-fetcher   # Regenerate API client from backend Swagger spec
```

EAS builds use channels: `development`, `preview`, `production`.

## Architecture

**Usetri** is a React Native/Expo app for grocery price comparison across Slovak supermarkets (Tesco, Billa, Lidl, Kaufland). Users search products, scan barcodes, and build shopping lists to find the cheapest store.

### Routing

File-based routing via **Expo Router**. Key route structure:

- `app/(app)/index.tsx` — Auth gate; redirects to tabs if authenticated
- `app/(app)/(auth)/` — Sign-in, sign-up, forgotten password
- `app/(app)/main/(tabs)/` — Bottom tabs: discounts, search, shopping-list, profile, brigader
- `app/(app)/product/[id].tsx` — Product detail (modal)
- `app/(app)/main/price-comparison-modal/` — Shop price comparison (modal)

The root layout (`app/_layout.tsx`) wraps the entire app in: `QueryClientProvider → RevenueCatProvider → SessionProvider → GestureHandlerRootView → BottomSheetModalProvider → ThemeProvider → SafeAreaProvider`.

### State Management

- **TanStack React Query** — All server state. Stale time 5 min, retry 2x.
- **React Context** — `AuthContext` (Firebase auth, guest mode, brigader mode) and `RevenueCatContext` (subscriptions/purchases).
- **MMKV** — Local persistence for theme, language, guest mode (`/src/persistence/`).

### API Layer

- `src/network/api-client.ts` — Axios client. Adds Firebase Bearer token + `user-id` header on every request. Auto-refreshes tokens on 401.
- `src/network/query/query.ts` — **Auto-generated** React Query hooks via Orval. Do not edit manually; run `npm run generate-fetcher` after backend changes.
- `src/network/model/` — Auto-generated TypeScript DTOs. Same rule applies.
- Backend base URL in `.env` as `EXPO_PUBLIC_API_URL`.

### Styling

**NativeWind** (Tailwind CSS for React Native). Semantic color tokens defined as CSS variables in `global.css` and mapped in `tailwind.config.js`. Custom brand palette: Violet (primary), Orange (CTA), Yellow (highlights), with variants `v1–v6`, `i1–i6`, `o1–o3`, `g1–g3`, `n1–n6`.

### Internationalization

i18next with Slovak (`sk`) as default and English (`en`) as fallback. Language stored in MMKV and switchable at runtime via `use-language` hook.

### Authentication

Firebase Auth (email/password, Google Sign-In, Apple Sign-In). Tokens stored in `expo-secure-store`. Guest mode allows browsing without login — API requests use `user-id: Anonymous user` header.

### Code Conventions

- Screens: `*-screen.tsx`
- Hooks: `use-*` (e.g., `use-cart-actions.ts`)
- Components: PascalCase files
- Path alias `~/` maps to the project root (configured in `tsconfig.json`)
- Linter is Biome (not ESLint). Rules: unused imports are errors, single quotes, no arrow function parens for single params. The `src/network/` generated directories are excluded from linting.
- SVGs are imported as React components via `react-native-svg-transformer`.

### Key Feature Modules (`src/features/`)

| Module | Purpose |
|---|---|
| `discounts/` | Browse store discount leaflets |
| `search/` | Product search with category grid |
| `shopping-list/` | Cart creation and management |
| `shop-comparison/` | Compare total cart cost across stores |
| `brigader/` | Data upload for price/discount crowd-sourcing |
| `settings/` | Theme and language switching |

### Third-Party Integrations

- **Firebase** — Auth, Crashlytics, Analytics
- **RevenueCat** — In-app purchases (`react-native-purchases`)
- **Vision Camera** — Barcode scanning
- **Gorhom Bottom Sheet** — Modal drawers
- **React Native Reanimated / Lottie** — Animations
