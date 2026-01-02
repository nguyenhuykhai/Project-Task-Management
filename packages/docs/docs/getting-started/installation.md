---
sidebar_position: 1
---

# Installation Guide

This guide will walk you through setting up the Micro Frontend Skeleton project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software    | Minimum Version | Recommended | Check Version    |
| ----------- | --------------- | ----------- | ---------------- |
| **Node.js** | 18.x            | 20.x LTS    | `node --version` |
| **pnpm**    | 9.x             | 9.15.0      | `pnpm --version` |
| **Git**     | 2.x             | Latest      | `git --version`  |

> [!IMPORTANT]
> This project **requires pnpm**. While npm and yarn may work, they are not officially supported due to Module Federation dependency hoisting requirements.

### Installing pnpm

If you don't have pnpm installed:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="os">
  <TabItem value="npm" label="Using npm" default>

```bash
npm install -g pnpm
```

  </TabItem>
  <TabItem value="homebrew" label="macOS (Homebrew)">

```bash
brew install pnpm
```

  </TabItem>
  <TabItem value="winget" label="Windows (winget)">

```bash
winget install pnpm
```

  </TabItem>
  <TabItem value="corepack" label="Using Corepack">

```bash
# Enable Corepack (comes with Node.js 16.13+)
corepack enable

# Install pnpm via Corepack
corepack prepare pnpm@9.15.0 --activate
```

  </TabItem>
</Tabs>

Verify installation:

```bash
pnpm --version
# Should output: 9.15.0 or higher
```

## Clone the Repository

Clone the project from your Git repository:

```bash
# HTTPS
git clone https://github.com/your-username/micro-fe-skeleton.git

# OR SSH
git clone git@github.com:your-username/micro-fe-skeleton.git

# Navigate to the project
cd micro-fe-skeleton
```

## Install Dependencies

The monorepo uses pnpm workspaces. A **single command** installs dependencies for all applications and packages:

```bash
pnpm install
```

This will install dependencies for:

- ✅ Root workspace
- ✅ `apps/mfe1` (Host application)
- ✅ `apps/mfe2` (Remote application)
- ✅ `packages/core` (Shared business logic)
- ✅ `packages/ui` (Shared UI components)

> [!TIP] > **pnpm is fast!** It uses a content-addressable store, so if you've installed these dependencies in other projects, installation will be near-instant.

### Verify Installation

Check that all workspaces are recognized:

```bash
pnpm list -r --depth 0
```

You should see:

```
micro-fe-skeleton@1.0.0
@repo/core@1.0.0
@repo/mfe1@1.0.0
@repo/mfe2@1.0.0
@repo/ui@1.0.0
```

## Environment Configuration

Both applications support environment variables for configuring remote URLs.

### mfe1 Environment Variables

Create a `.env.local` file in `apps/mfe1`:

```bash title="apps/mfe1/.env.local"
# Remote (mfe2) configuration
VITE_MFE2_BASE_URL=http://localhost:3002
VITE_MFE2_SCOPE=remote
```

> [!NOTE]
> These values are **optional** and default to `http://localhost:3002` for development.

### mfe2 Environment Variables

Create a `.env.local` file in `apps/mfe2`:

```bash title="apps/mfe2/.env.local"
# Host (mfe1) configuration
VITE_MFE1_BASE_URL=http://localhost:3001
VITE_MFE1_SCOPE=host
```

> [!NOTE]
> These values are **optional** and default to `http://localhost:3001` for development.

## Running the Applications

> [!WARNING] > **Important:** You must start **mfe2 (remote) first**, then mfe1 (host), because mfe1 depends on mfe2's exposed modules.

### Option 1: Run Both Applications in Parallel

The easiest way to run both applications:

```bash
pnpm dev
```

This runs both `mfe1` and `mfe2` concurrently using pnpm's `--parallel` flag.

**Expected Output:**

```
> @repo/mfe1@1.0.0 dev
> pnpm rsbuild dev --open

> @repo/mfe2@1.0.0 dev
> pnpm rsbuild dev --open

  ➜ Local:   http://localhost:3001/    (mfe1)
  ➜ Local:   http://localhost:3002/    (mfe2)
```

### Option 2: Run Applications Individually

For more control or debugging, run each application in separate terminals:

**Terminal 1 - Start mfe2 (Remote):**

```bash
pnpm dev:mfe2
```

Wait for:

```
✓ Rsbuild compiled successfully in 1.2s
  ➜ Local:   http://localhost:3002/
```

**Terminal 2 - Start mfe1 (Host):**

```bash
pnpm dev:mfe1
```

Wait for:

```
✓ Rsbuild compiled successfully in 1.5s
  ➜ Local:   http://localhost:3001/
```

### Option 3: Use pnpm Filter Commands

Run specific applications using the `--filter` flag:

```bash
# Run mfe1 only
pnpm --filter @repo/mfe1 dev

# Run mfe2 only
pnpm --filter @repo/mfe2 dev
```

## Accessing the Applications

Once both applications are running:

| Application       | URL                   | Description                              |
| ----------------- | --------------------- | ---------------------------------------- |
| **mfe1 (Host)**   | http://localhost:3001 | Main application with admin panel layout |
| **mfe2 (Remote)** | http://localhost:3002 | Standalone remote application            |

> [!TIP]
> Visit http://localhost:3001 to see the Host application consuming remote components from mfe2!

## Development Workflow

### Hot Module Replacement (HMR)

Both applications support **Hot Module Replacement** out of the box:

- ✅ Changes to `.tsx` files reload instantly
- ✅ Changes to `.css` files apply without refresh
- ✅ Changes to shared packages (`@repo/core`, `@repo/ui`) trigger rebuilds

### Making Changes to Shared Packages

When you edit files in `packages/core` or `packages/ui`:

1. **Save the file**
2. **Watch the terminal** - Rsbuild will detect the change
3. **Check the browser** - Changes will be reflected automatically

No manual rebuild or restart is needed!

### Type Checking

Run TypeScript type checking across all workspaces:

```bash
# Check all workspaces
pnpm typecheck

# Check specific workspace
pnpm --filter @repo/mfe1 typecheck
```

### Code Formatting

Format code with Prettier:

```bash
# Format all files
pnpm format

# Check formatting without changes
pnpm format:check
```

## Troubleshooting

### Issue: `pnpm: command not found`

**Solution:** Install pnpm globally:

```bash
npm install -g pnpm
```

### Issue: Module Federation errors

**Symptoms:**

- `Uncaught Error: Shared module is not available for eager consumption`
- `Cannot read properties of undefined (reading 'call')`

**Solution:**

1. Stop all dev servers
2. Clean all caches and dependencies:

```bash
pnpm clean
```

3. Reinstall:

```bash
pnpm install
```

4. Restart servers in order: **mfe2 first**, then **mfe1**

### Issue: Port already in use

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

<Tabs groupId="os">
  <TabItem value="windows" label="Windows" default>

```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process by PID
taskkill /PID <PID> /F
```

  </TabItem>
  <TabItem value="macos" label="macOS/Linux">

```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

  </TabItem>
</Tabs>

### Issue: Changes in shared packages not reflecting

**Solution:**

1. Verify workspace links:

```bash
pnpm list -r --depth 1 | grep @repo
```

2. Restart dev servers:

```bash
pnpm dev
```

3. If still not working, rebuild packages:

```bash
pnpm build:packages
```

### Issue: TypeScript errors with workspace packages

**Solution:**

1. Check `tsconfig.json` path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/core": ["../../packages/core/src"],
      "@repo/ui": ["../../packages/ui/src"]
    }
  }
}
```

2. Reload TypeScript server in VS Code:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "TypeScript: Restart TS Server"

### Issue: Tailwind styles not applying

**Solution:**

1. Verify Tailwind config in `tailwind.config.ts`:

```typescript
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include shared UI
  ],
};
```

2. Restart dev server

## Next Steps

Now that your environment is set up, you're ready to:

1. **Explore the codebase** - See [Project Structure](../technical/project-structure.md)
2. **Learn about deployment** - See [Deployment Guide](./deployment.md)
3. **Start building** - Add new features or micro-frontends!

---

**Having issues?** Check the [GitHub Issues](https://github.com/your-username/micro-fe-skeleton/issues) or ask for help in our community.
