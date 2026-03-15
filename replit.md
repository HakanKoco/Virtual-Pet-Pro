# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── digital-pet/        # Expo React Native mobile app (Digital Pet)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Digital Pet App (`artifacts/digital-pet`)

**Full-featured gamified digital pet mobile app** built with Expo + React Native.

### Architecture

- **Routing**: Expo Router with file-based routing, 4 tabs
- **State**: React Context (PetContext) with AsyncStorage persistence
- **Gamification**: XP/Level system, streak tracking, 21 achievements, daily tasks
- **Pet Stats**: hunger, happiness, energy, cleanliness, health (all clamped 0-100)
- **Mood System**: 7 mood levels (ecstatic → desperate) with dynamic colors & emojis
- **Actions**: feed, play, sleep, clean, heal — each with XP rewards and cooldowns

### File Structure

```text
artifacts/digital-pet/
├── app/
│   ├── _layout.tsx          # Root layout with PetProvider
│   └── (tabs)/
│       ├── _layout.tsx      # 4-tab layout (NativeTabs + ClassicTabs)
│       ├── index.tsx        # Home screen (pet avatar, stats, actions)
│       ├── achievements.tsx # Achievements with filtering
│       ├── stats.tsx        # Detailed stats dashboard
│       └── settings.tsx     # Rename pet, view progress, reset
├── context/
│   └── PetContext.tsx       # Main game state + AsyncStorage persistence
├── components/
│   ├── PetAvatar.tsx        # Animated floating pet avatar
│   ├── AchievementCard.tsx  # Individual achievement display
│   ├── AchievementToast.tsx # Top-slide toast for new achievements
│   ├── DailyTaskCard.tsx    # Daily task tracker
│   ├── LevelUpModal.tsx     # Animated level-up celebration modal
│   ├── StreakBadge.tsx      # Streak display with gradient
│   └── ui/
│       ├── ActionButton.tsx # Gradient action buttons with cooldown
│       ├── StatBar.tsx      # Animated stat progress bars
│       └── XPBar.tsx        # Animated XP progress bar
├── constants/
│   ├── colors.ts            # Full dark theme color palette
│   ├── gameConfig.ts        # XP config, action effects, decay rates
│   └── achievements.ts      # 21 achievements with categories
└── utils/
    └── petHelpers.ts        # Mood calc, stat helpers, formatters
```

### Key Features
- Dark theme UI with purple/gold/teal accent palette
- Animated floating pet avatar with glow ring (mood-aware color)
- Animated stat bars with spring physics
- 21 achievements across 4 categories (milestones, actions, streaks, special)
- Haptic feedback on all interactions
- iOS liquid glass tab bar (NativeTabs on iOS 26+)
- Level-up celebration modal with spinning star animation
- Achievement toast notifications with queue system
- Stat decay over time (simulates real pet care)
- Daily task system tracking

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec and Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.
