# @repo/ui - Shared UI Components

Shared UI component library built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) for the micro-frontend monorepo.

## 📦 Available Components

### Shadcn/UI Components (14)

Avatar, Badge, Breadcrumb, Button, Card, Collapsible, Dropdown Menu, Input, Scroll Area, Separator, Sheet, Sidebar, Skeleton, Tooltip

### Custom Components

- **Loader** - 5 animated loading components (LoaderOne to LoaderFive)
- **EventDebugger** - Development tool for monitoring event bus

## 🚀 Usage

```typescript
import { Button, Card, Input, Avatar } from "@repo/ui";

function Example() {
  return (
    <Card>
      <Avatar src="/avatar.jpg" fallback="JD" />
      <Input placeholder="Email" />
      <Button variant="default">Save</Button>
      <Button variant="destructive">Delete</Button>
    </Card>
  );
}
```

## ➕ Adding New UI Components

### Step 1: Navigate to UI Package

```bash
cd packages/ui
```

### Step 2: Add Component with Shadcn CLI

```bash
# Interactive mode - select from list
pnpm ui:add

# Direct install
pnpm ui:add dialog
pnpm ui:add select
pnpm ui:add tabs
```

The component will be created in `src/components/ui/`

### Step 3: Export the Component

Open `src/index.ts` and add the export:

```typescript
export * from "./components/ui/dialog";
```

### Step 4: Use in Your App

```typescript
import { Dialog } from "@repo/ui";

<Dialog>
  {/* Your content */}
</Dialog>
```

## 📖 Storybook

Develop and test components in isolation using Storybook.

### Running Storybook

```bash
cd packages/ui
pnpm storybook
```

Storybook will open at **http://localhost:6006**

### Building Storybook

Build static Storybook for deployment:

```bash
cd packages/ui
pnpm build-storybook
```

Output will be in `storybook-static/`

### Available Stories

- **Button** - All variants and sizes with interactive controls
- **Card** - Different card layouts
- **Input** - Various input types and states
- **Avatar** - Image and fallback examples

### Creating New Stories

Create a `.stories.tsx` file next to your component:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./your-component";

const meta: Meta<typeof YourComponent> = {
  title: "UI/YourComponent",
  component: YourComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // component props
  },
};
```

## 🎯 Portal Container Context

### Why This Matters for Micro-Frontends

When building micro-frontends with scoped CSS (using Tailwind's `important` selector), portal-based components (like `DropdownMenu`, `Sheet`, `Dialog`) render outside your app's root container by default. This causes Tailwind styles to not apply.

**The Problem:**

```tsx
// ❌ Dropdown menu renders to document.body, outside #mfe1-root
// Tailwind styles with `important: "#mfe1-root"` don't apply!
<DropdownMenuContent>...</DropdownMenuContent>
```

**The Solution:**
We provide a `PortalContainerProvider` that automatically configures all portal components to render within your scoped container.

### Usage

#### 1. Wrap Your App (Once)

In your app's bootstrap file:

```tsx
import { PortalContainerProvider } from "@repo/ui";

const rootElement = document.getElementById("root")!;
const mfe1Container = document.getElementById("mfe1-root");

root.render(
  <PortalContainerProvider container={mfe1Container}>
    <App />
  </PortalContainerProvider>
);
```

#### 2. Use Portal Components Normally

All portal components now automatically use the container from context:

```tsx
// ✅ No manual container prop needed!
<DropdownMenuContent className="w-56">...</DropdownMenuContent>
<SheetContent>...</SheetContent>
```

#### 3. Override When Needed (Optional)

You can still override the container for specific components:

```tsx
<DropdownMenuContent container={customElement}>...</DropdownMenuContent>
```

### Supported Components

The following components automatically use `PortalContainerProvider`:

- `DropdownMenuContent`
- `SheetContent`
- Any other portal-based Radix UI components in this package

### Technical Details

- **Context**: `PortalContainerContext` provides the container element
- **Hook**: `usePortalContainer()` to access the container in custom components
- **Fallback**: If no provider is present, portals render to `document.body` (default Radix UI behavior)

## 🔒 CSS Isolation Setup

Each micro-frontend has isolated styles using ID-scoped Tailwind to prevent conflicts.

### How It Works

**MFE1** wraps everything in `#mfe1-root`:

```tsx
<div id="mfe1-root">
  <App />
</div>
```

**MFE2** wraps everything in `#mfe2-root`:

```tsx
<div id="mfe2-root">
  <App />
</div>
```

### Setting Up Isolation for a New Micro-Frontend

#### 1. Create CSS File

Create `apps/your-mfe/src/your-mfe.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

@custom-variant dark (&:is(.dark *));

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Define CSS variables scoped to your app */
#your-mfe-root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 72.2% 50.6%;
  --primary-foreground: 0 85.7% 97.3%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 72.2% 50.6%;
  --radius: 0.5rem;
}

#your-mfe-root.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 72.2% 50.6%;
  --primary-foreground: 0 85.7% 97.3%;
  /* ... other dark mode variables */
}
```

**Important**: Use **space-separated** HSL values (no commas):

- ✅ `--primary: 0 72.2% 50.6%;`
- ❌ `--primary: 0, 72.2%, 50.6%;`

#### 2. Create Tailwind Config

Create `apps/your-mfe/tailwind.config.ts`:

```typescript
import { createConfig } from "@repo/ui/tailwind.config";

const baseConfig = createConfig({
  important: "#your-mfe-root", // Scope all styles to your app
});

export default {
  ...baseConfig,
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  important: "#your-mfe-root",
};
```

#### 3. Wrap Your App

In your bootstrap/main file:

```tsx
import "./your-mfe.css";

function App() {
  return <div id="your-mfe-root">{/* Your entire app */}</div>;
}
```

#### 4. Verify Isolation

- ✅ Your styles only apply inside `#your-mfe-root`
- ✅ Other micro-frontends' styles don't affect your app
- ✅ Shared `@repo/ui` components work correctly

## 🔍 Troubleshooting

### Components Not Styled

**Check 1**: CSS file imported?

```typescript
import "./your-mfe.css";
```

**Check 2**: Root container has correct ID?

```tsx
<div id="your-mfe-root">{/* Must match CSS selector */}</div>
```

## 📚 Resources

- [Shadcn/UI Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Available Shadcn Components](https://ui.shadcn.com/docs/components)
