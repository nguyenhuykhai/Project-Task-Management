---
sidebar_position: 2
---

# Project Structure

This page provides a comprehensive breakdown of the monorepo structure, explaining the purpose of each directory and key configuration files.

## Monorepo Overview

```
micro-fe-skeleton/
├── apps/                   # Micro-frontend applications
│   ├── mfe1/              # Host application
│   └── mfe2/              # Remote application
├── packages/               # Shared packages
│   ├── core/              # Business logic & Event Bus
│   └── ui/                # UI components & Tailwind
├── package.json            # Root workspace config
├── pnpm-workspace.yaml     # Workspace definitions
├── .npmrc                  # pnpm configuration
└── tsconfig.base.json      # Shared TypeScript config
```

## Root Configuration Files

### `pnpm-workspace.yaml`

Defines which directories are part of the pnpm workspace:

```yaml title="pnpm-workspace.yaml"
packages:
  - "apps/*"
  - "packages/*"
```

### `package.json`

Root workspace configuration with scripts to run all applications:

```json title="package.json"
{
  "name": "micro-fe-skeleton",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "pnpm --parallel --filter \"@repo/*\" dev",
    "build": "pnpm --recursive --filter \"@repo/*\" build",
    "typecheck": "pnpm --recursive --filter \"@repo/*\" typecheck"
  }
}
```

### `.npmrc`

Critical configuration for Module Federation to work correctly:

```ini title=".npmrc"
# Prevents pnpm from hoisting dependencies
# Required for Module Federation to resolve shared modules correctly
public-hoist-pattern[]=*
shamefully-hoist=true
```

> [!WARNING] > **Do not remove** the `shamefully-hoist=true` setting. Module Federation requires dependencies to be hoisted to the root `node_modules`.

### `tsconfig.base.json`

Shared TypeScript configuration inherited by all packages:

```json title="tsconfig.base.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Applications Structure

### mfe1 (Host Application)

```
apps/mfe1/
├── src/
│   ├── App.tsx                 # Root component
│   ├── bootstrap.tsx           # Module Federation entry
│   ├── index.tsx               # Application entry
│   ├── components/             # React components
│   │   ├── common/             # Shared components
│   │   │   ├── loader/         # Loading components
│   │   │   └── templates/      # Page templates (NotFound)
│   │   └── layouts/            # Layout components
│   │       └── admin-panel/    # Admin sidebar layout
│   ├── constants/              # App constants
│   │   └── menu.ts             # Navigation menu config
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── pages/                  # Page components
│   ├── router/                 # React Router setup
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   └── mfe1.css                # App-specific styles
├── rsbuild.config.ts           # Rsbuild & Module Federation config
├── tsconfig.json               # TypeScript config (extends base)
├── tailwind.config.ts          # Tailwind CSS config
└── package.json                # Dependencies & scripts
```

#### Key Files Explained

| File                  | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| **index.tsx**         | Entry point, imports `bootstrap.tsx`            |
| **bootstrap.tsx**     | Async entry for Module Federation               |
| **App.tsx**           | Root React component with providers             |
| **rsbuild.config.ts** | Build configuration and Module Federation setup |

**Why `bootstrap.tsx`?**

Module Federation requires **async imports** to load remote modules. The pattern is:

```typescript title="index.tsx"
import("./bootstrap");
```

```typescript title="bootstrap.tsx"
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### mfe2 (Remote Application)

```
apps/mfe2/
├── src/
│   ├── App.tsx                 # Root component
│   ├── bootstrap.tsx           # Module Federation entry
│   ├── index.tsx               # Application entry
│   ├── components/
│   │   └── export-app/         # Exported Button component
│   ├── pages/                  # Page components
│   ├── router/                 # React Router setup
│   ├── types/                  # TypeScript types
│   │   └── host.d.ts           # Type definitions for host
│   └── mfe2.css                # App-specific styles
├── rsbuild.config.ts           # Rsbuild & Module Federation config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies & scripts
```

#### Consuming Host Components

mfe2 can import components from mfe1 using TypeScript declarations:

```typescript title="apps/mfe2/src/types/host.d.ts"
declare module "host/NotFound" {
  const NotFound: React.ComponentType;
  export default NotFound;
}
```

Usage:

```typescript
import NotFound from "host/NotFound";

function ErrorPage() {
  return <NotFound />;
}
```

## Shared Packages Structure

### @repo/core

Business logic, Event Bus, and shared utilities.

```
packages/core/
├── src/
│   ├── event-bus/
│   │   └── index.ts            # Event Bus implementation
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── use-notification-store.ts   # Zustand store
│   │   └── useEventSpy.ts              # Event debugging hook
│   ├── services/
│   │   ├── index.ts
│   │   └── notification-service.ts     # Notification API
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   └── index.ts                # Package entry point
├── tsconfig.json
└── package.json
```

#### Exports

```typescript title="packages/core/src/index.ts"
export * from "./event-bus"; // publishEvent, subscribeEvent
export * from "./hooks"; // useNotificationStore
export * from "./hooks/useEventSpy"; // useEventSpy
export * from "./services"; // notificationService
export * from "./types"; // TypeScript interfaces
```

#### Import Examples

```typescript
// Import Event Bus
import { publishEvent, subscribeEvent } from "@repo/core";

// Import notification service
import { notificationService } from "@repo/core";

// Import Zustand store
import { useNotificationStore } from "@repo/core";
```

### @repo/ui

Shared UI components, Tailwind configuration, and utilities.

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/                 # 13 Radix UI components
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   └── common/             # Custom components
│   │       └── loader/         # Loading spinner
│   ├── contexts/
│   │   └── portal-container.tsx    # Portal provider
│   ├── devtools/
│   │   └── EventDebugger/      # Event debugging UI
│   ├── hooks/
│   │   └── use-mobile.tsx      # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts            # cn() utility
│   ├── index.ts                # Package entry point
│   └── styles.css              # Global styles
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json
└── package.json
```

#### Exports

```typescript title="packages/ui/src/index.ts"
// Utility
export { cn } from "./lib/utils";

// UI components (13 total)
export * from "./components/ui/avatar";
export * from "./components/ui/button";
export * from "./components/ui/card";
// ... and more

// Contexts
export {
  PortalContainerProvider,
  usePortalContainer,
} from "./contexts/portal-container";

// Custom components
export * from "./components/common/loader";

// DevTools
export * from "./devtools/EventDebugger";
```

#### Import Examples

```typescript
// Import UI components
import { Button } from "@repo/ui";
import { Card, CardHeader, CardContent } from "@repo/ui";

// Import utilities
import { cn } from "@repo/ui";

// Import contexts
import { PortalContainerProvider } from "@repo/ui";

// Import DevTools
import { EventDebugger } from "@repo/ui";
```

## Path Aliases

TypeScript path aliases make imports cleaner and more maintainable.

### In Applications (mfe1, mfe2)

```json title="apps/mfe1/tsconfig.json"
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/core": ["../../packages/core/src"],
      "@repo/ui": ["../../packages/ui/src"]
    }
  }
}
```

### In Shared Packages

```json title="packages/core/tsconfig.json"
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/core": ["./src"]
    }
  }
}
```

## Module Federation Configuration

### mfe1 Configuration

```typescript title="apps/mfe1/rsbuild.config.ts"
export default defineConfig({
  server: {
    port: 3001,
    host: "localhost",
    cors: true,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "host",
      remotes: {
        remote: "remote@http://localhost:3002/remoteEntry.js",
      },
      exposes: {
        "./NotFound": "./src/components/common/templates/NotFound",
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
      },
      bridge: {
        enableBridgeRouter: true, // React Router integration
      },
    }),
  ],
});
```

### mfe2 Configuration

```typescript title="apps/mfe2/rsbuild.config.ts"
export default defineConfig({
  server: {
    port: 3002,
    host: "localhost",
    cors: true,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "remote",
      exposes: {
        "./Button": "./src/components/export-app",
      },
      filename: "remoteEntry.js",
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
      },
      bridge: {
        enableBridgeRouter: true,
      },
    }),
  ],
});
```

## File Naming Conventions

| Pattern        | Example                                     | Use Case                    |
| -------------- | ------------------------------------------- | --------------------------- |
| **PascalCase** | `App.tsx`, `NotFound.tsx`                   | React components            |
| **kebab-case** | `use-mobile.tsx`, `notification-service.ts` | Hooks, utilities, services  |
| **lowercase**  | `index.ts`, `utils.ts`                      | Entry points, utility files |
| **UPPERCASE**  | `README.md`, `VERCEL_DEPLOYMENT_GUIDE.md`   | Documentation               |

## Dependency Graph

```mermaid
graph TD
    MFE1[mfe1 Application]
    MFE2[mfe2 Application]
    CORE[@repo/core]
    UI[@repo/ui]

    MFE1 --> CORE
    MFE1 --> UI
    MFE2 --> CORE
    MFE2 --> UI
    MFE1 -.->|consumes| MFE2
    MFE2 -.->|consumes| MFE1

    style MFE1 fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style MFE2 fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    style CORE fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style UI fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
```

## Next Steps

Continue to [Installation Guide](../getting-started/installation.md) to set up the project locally.
