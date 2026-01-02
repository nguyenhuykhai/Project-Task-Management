---
sidebar_position: 1
---

# System Overview

This page provides a comprehensive overview of the Micro Frontend architecture, focusing on how **Module Federation** orchestrates the interaction between the host application (`mfe1`) and remote application (`mfe2`).

## High-Level Architecture

The architecture follows a **bidirectional Module Federation** pattern where both applications can expose and consume components from each other.

```mermaid
graph LR
    subgraph "Browser Runtime"
        subgraph "mfe1:3001 - Host Application"
            H1[React App]
            H2[Router]
            H3[Exposes: NotFound]
        end

        subgraph "mfe2:3002 - Remote Application"
            R1[React App]
            R2[Router]
            R3[Exposes: Button]
        end

        subgraph "@repo/core Package"
            C1[Event Bus]
            C2[Notification Service]
            C3[Zustand Stores]
        end

        subgraph "@repo/ui Package"
            U1[Radix UI Components]
            U2[Tailwind Config]
            U3[Utility Functions]
        end
    end

    H1 --> |Consumes| R3
    R1 --> |Consumes| H3
    H1 --> C1
    R1 --> C1
    H1 --> U1
    R1 --> U1

    style H1 fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style R1 fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    style C1 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style U1 fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
```

## Host Application (mfe1)

> [!IMPORTANT]
> The host application acts as the **container** that orchestrates the overall user experience and dynamically loads remote modules at runtime.

### Key Responsibilities

- **Application Shell**: Provides the main layout, navigation, and routing infrastructure
- **Remote Integration**: Dynamically loads and renders components from remote applications
- **Shared Context**: Manages global state and provides context to remote applications
- **Entry Point**: Serves as the primary entry point for end users

### Exposes

| Export Name  | Component Path                               | Purpose                  |
| ------------ | -------------------------------------------- | ------------------------ |
| `./NotFound` | `./src/components/common/templates/NotFound` | 404 error page component |

### Consumes

- **Remote components** from `mfe2` (configured via `VITE_MFE2_BASE_URL`)

### Configuration

```typescript title="apps/mfe1/rsbuild.config.ts"
{
  name: "host",
  remotes: {
    remote: "remote@http://localhost:3002/remoteEntry.js"
  },
  exposes: {
    "./NotFound": "./src/components/common/templates/NotFound"
  }
}
```

## Remote Application (mfe2)

> [!TIP]
> Remote applications are **independently deployable** units that can be consumed by the host or other remote applications.

### Key Responsibilities

- **Feature Modules**: Encapsulates specific features or business domains
- **Independent Deployment**: Can be deployed without affecting the host
- **Component Exposure**: Exposes reusable components for other applications
- **Standalone Mode**: Can run independently for development and testing

### Exposes

| Export Name | Component Path                | Purpose                     |
| ----------- | ----------------------------- | --------------------------- |
| `./Button`  | `./src/components/export-app` | Exportable button component |

### Consumes

- **Host components** from `mfe1` (configured via `VITE_MFE1_BASE_URL`)

### Configuration

```typescript title="apps/mfe2/rsbuild.config.ts"
{
  name: "remote",
  exposes: {
    "./Button": "./src/components/export-app"
  },
  filename: "remoteEntry.js"
}
```

## Runtime Behavior

### Initial Load Sequence

```mermaid
sequenceDiagram
    participant Browser
    participant mfe1 as mfe1 (Host)
    participant mfe2 as mfe2 (Remote)
    participant Shared as Shared Packages

    Browser->>mfe1: Navigate to http://localhost:3001
    mfe1->>mfe1: Load main bundle
    mfe1->>Shared: Load @repo/core & @repo/ui
    mfe1->>mfe2: Request remoteEntry.js
    mfe2-->>mfe1: Return remote manifest
    mfe1->>mfe1: Register remote modules

    Note over mfe1: User navigates to route using remote component

    mfe1->>mfe2: Load ./Button module
    mfe2-->>mfe1: Return Button component
    mfe1->>Browser: Render complete page with remote component
```

### Dynamic Module Loading

1. **Host Initialization**: mfe1 loads and initializes its core bundles
2. **Remote Registration**: mfe1 fetches `remoteEntry.js` from mfe2
3. **Lazy Loading**: Remote components are loaded on-demand when needed
4. **Shared Dependencies**: React and React-DOM are loaded once (singleton mode)
5. **Rendering**: Remote components render seamlessly within the host application

## Shared Dependencies Strategy

Both applications share critical dependencies to avoid duplicate code and ensure compatibility.

```typescript title="Shared Configuration"
{
  shared: {
    react: {
      singleton: true,        // Only one instance across all MFEs
      requiredVersion: false  // Accept any version
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false
    }
  }
}
```

> [!WARNING] > **Singleton Mode** ensures only one instance of React is loaded. Without this, you'll encounter the infamous "Invalid Hook Call" error.

### Dependency Resolution Rules

| Scenario               | Behavior                                        |
| ---------------------- | ----------------------------------------------- |
| **Same version**       | Share the dependency                            |
| **Different versions** | Use the version from the host (singleton: true) |
| **Missing dependency** | Load from the consuming application             |

## Deployment Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Local Development"
        Dev["Developer Machine"]

        subgraph "Port 3001"
            MFE1["mfe1 (Host)<br/>Rsbuild Dev Server"]
        end

        subgraph "Port 3002"
            MFE2["mfe2 (Remote)<br/>Rsbuild Dev Server"]
        end
    end

    Dev --> MFE1
    Dev --> MFE2
    MFE1 --> |HMR via WebSocket| Dev
    MFE2 --> |HMR via WebSocket| Dev
    MFE1 -.->|Fetch remote modules| MFE2

    style MFE1 fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style MFE2 fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
```

### Production Environment

In production, each micro-frontend is deployed to its own URL:

```mermaid
graph TB
    subgraph "Production"
        CDN["CDN / Edge Network"]

        subgraph "Vercel Deployment 1"
            MFE1P["mfe1.vercel.app"]
        end

        subgraph "Vercel Deployment 2"
            MFE2P["mfe2.vercel.app"]
        end

        User["End Users"]
    end

    User --> CDN
    CDN --> MFE1P
    CDN --> MFE2P
    MFE1P -.->|Fetch remote modules| MFE2P

    style MFE1P fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style MFE2P fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
```

> [!IMPORTANT] > **Environment Variables** are used to configure remote URLs dynamically based on the deployment environment (dev, staging, production).

## Monorepo Structure Benefits

The **pnpm workspace** structure provides several advantages:

✅ **Shared Packages**: `@repo/core` and `@repo/ui` are reused across all applications  
✅ **Dependency Deduplication**: pnpm installs shared dependencies only once  
✅ **Type Safety**: TypeScript types are shared across the monorepo  
✅ **Atomic Changes**: Changes to shared packages are reflected immediately  
✅ **Efficient CI/CD**: Build only what changed

## Next Steps

Continue to [Communication Patterns](./communication.md) to learn how micro-frontends communicate with each other using the Event Bus.
