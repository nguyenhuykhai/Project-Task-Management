# Docusaurus Module Federation Setup

## Running Modes

### For Standalone Development (Testing Docs Alone)

```bash
cd packages/docs
pnpm dev
```

Access at: `http://localhost:3003/`

### For Module Federation Mode (Consumed by mfe1)

```bash
cd packages/docs
pnpm start
```

Access at: `http://localhost:3003/docs/` or via mfe1 at `http://localhost:3001/docs`

## Why Two Modes?

- **Standalone (`pnpm dev`)**: BaseUrl is `/`, normal Docusaurus development
- **MFE Mode (`pnpm start`)**: BaseUrl is `/docs`, matches the route in mfe1

## Full Integration Test

1. Terminal 1 - Start docs in MFE mode:

   ```bash
   cd packages/docs
   pnpm start
   ```

2. Terminal 2 - Start mfe1:

   ```bash
   cd apps/mfe1
   pnpm dev
   ```

3. Visit: `http://localhost:3001/docs`
