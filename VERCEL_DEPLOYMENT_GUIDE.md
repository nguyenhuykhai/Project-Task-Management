# Vercel Deployment Guide for Micro Frontend Monorepo

This guide outlines the exact settings you need to configure in the Vercel Dashboard for deploying both `mfe1` (HOST) and `mfe2` (REMOTE) applications.

---

## 📋 Prerequisites

Before deploying, ensure:

1. Your GitHub/GitLab repository is connected to Vercel
2. You have access to the Vercel Dashboard
3. Both apps have their `vercel.json` files in place

---

## 🔧 Project 1: mfe2 (REMOTE Application)

### **Step 1: Create New Project**

1. Go to Vercel Dashboard → **Add New** → **Project**
2. Import your repository: `micro-fe-skeleton`
3. Click **Configure Project**

### **Step 2: Framework & Build Settings**

> **✨ Note:** Most settings are now configured in [`apps/mfe2/vercel.json`](file:///d:/Work/Hopper/micro-fe-skeleton/apps/mfe2/vercel.json). You only need to set the **Root Directory** in the Dashboard.

| Setting              | Value                                    |
| -------------------- | ---------------------------------------- |
| **Framework Preset** | Other _(auto-detected from vercel.json)_ |
| **Root Directory**   | `apps/mfe2` ⚠️ **Set this manually**     |
| **Build Command**    | _(Configured in vercel.json)_            |
| **Output Directory** | _(Configured in vercel.json)_            |
| **Install Command**  | _(Configured in vercel.json)_            |

### **Step 3: Environment Variables**

No environment variables are required for `mfe2` initially. Add any backend API URLs or feature flags as needed.

### **Step 4: Deploy**

Click **Deploy** and wait for the build to complete.

### **Step 5: Copy the Production URL**

After deployment, **copy the production URL** (e.g., `https://mfe2-xyz123.vercel.app`). You'll need this for configuring `mfe1`.

---

## 🔧 Project 2: mfe1 (HOST Application)

### **Step 1: Create New Project**

1. Go to Vercel Dashboard → **Add New** → **Project**
2. Import the same repository: `micro-fe-skeleton`
3. Click **Configure Project**

### **Step 2: Framework & Build Settings**

> **✨ Note:** Most settings are now configured in [`apps/mfe1/vercel.json`](file:///d:/Work/Hopper/micro-fe-skeleton/apps/mfe1/vercel.json). You only need to set the **Root Directory** in the Dashboard.

| Setting              | Value                                    |
| -------------------- | ---------------------------------------- |
| **Framework Preset** | Other _(auto-detected from vercel.json)_ |
| **Root Directory**   | `apps/mfe1` ⚠️ **Set this manually**     |
| **Build Command**    | _(Configured in vercel.json)_            |
| **Output Directory** | _(Configured in vercel.json)_            |
| **Install Command**  | _(Configured in vercel.json)_            |

### **Step 3: Environment Variables**

This is **CRITICAL** for Module Federation. Add the following environment variable:

| Key                  | Value                      | Example                          |
| -------------------- | -------------------------- | -------------------------------- |
| `VITE_MFE2_BASE_URL` | **Production URL of mfe2** | `https://mfe2-xyz123.vercel.app` |

> **⚠️ IMPORTANT:**
>
> - Replace `https://mfe2-xyz123.vercel.app` with the **actual production URL** from Step 5 of the mfe2 deployment.
> - Ensure there's **NO trailing slash** (e.g., `https://mfe2-xyz123.vercel.app` ✅, `https://mfe2-xyz123.vercel.app/` ❌)

#### **How to Find the mfe2 URL:**

1. Go to the Vercel Dashboard
2. Select the `mfe2` project
3. Copy the **Production Domain** (looks like `mfe2-xyz123.vercel.app`)
4. Prepend `https://` to form the full URL

### **Step 4: Deploy**

Click **Deploy** and wait for the build to complete.

---

## 🔄 Post-Deployment: Updating Environment Variables

If you need to update the `mfe2` URL (e.g., after redeploying or changing domains):

1. Go to `mfe1` project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update `VITE_MFE2_BASE_URL` with the new URL
4. Click **Save**
5. Go to **Deployments** → select the latest deployment → click **Redeploy**

---

## 🧪 Verification Checklist

After both deployments are complete:

- [ ] Visit the `mfe1` production URL
- [ ] Open browser DevTools → Console
- [ ] Verify no CORS errors related to `remoteEntry.js`
- [ ] Navigate to pages that load `mfe2` components
- [ ] Verify Module Federation loads correctly
- [ ] Test client-side routing (refresh on nested routes)

---

## 🚨 Common Issues & Fixes

### **Issue 0: pnpm Install Fails with ERR_INVALID_THIS** ⚠️ **CRITICAL**

**Error:** `GET https://registry.npmjs.org/... error (ERR_INVALID_THIS). Will retry in X seconds.`

**Root Cause:**  
This occurs due to Node.js version incompatibility or pnpm network issues in Vercel's CI environment.

**Fix Applied (Already Implemented):**
We've implemented a **three-part solution**:

1. **`.node-version` file** (root directory) → Forces Vercel to use Node.js 20.x
2. **Updated `.npmrc`** → Added network timeout and retry configurations:
   ```
   network-timeout=300000
   fetch-retries=5
   fetch-retry-mintimeout=10000
   fetch-retry-maxtimeout=60000
   ```
3. **Updated `vercel.json` files** → Modified to use:
   - `installCommand: "pnpm install --no-frozen-lockfile"`
   - Corrected `outputDirectory` to `dist` (relative to Root Directory)

**Verification:**

- ✅ Commit all changes (`.node-version`, `.npmrc`, both `vercel.json` files)
- ✅ Push to repository
- ✅ Trigger new deployment in Vercel
- ✅ Check build logs for successful `pnpm install`

### **Issue 1: CORS Error on `remoteEntry.js`**

**Error:** `Access to fetch at 'https://mfe2.../remoteEntry.js' blocked by CORS`

**Fix:**

- Verify `apps/mfe2/vercel.json` includes the `headers` configuration
- Redeploy `mfe2`

### **Issue 2: Module Federation Not Loading**

**Error:** `Failed to load remote entry`

**Fix:**

- Ensure `VITE_MFE2_BASE_URL` in `mfe1` is set correctly
- Check that the environment variable has **no trailing slash**
- Verify `mfe2` is successfully deployed and accessible

### **Issue 3: 404 on Client-Side Routes**

**Error:** Refreshing on `/dashboard` returns 404

**Fix:**

- Verify `apps/mfe1/vercel.json` and `apps/mfe2/vercel.json` include the `rewrites` configuration
- Redeploy the affected app

---

## 🔐 Production Best Practices

1. **Use Custom Domains:**  
   Assign custom domains in Vercel (e.g., `host.yourdomain.com`, `remote.yourdomain.com`) and update `VITE_MFE2_BASE_URL` accordingly.

2. **Environment-Specific URLs:**  
   Use different environment variables for Preview vs. Production deployments:
   - Production: `VITE_MFE2_BASE_URL=https://remote.yourdomain.com`
   - Preview: `VITE_MFE2_BASE_URL=https://mfe2-git-dev-xyz.vercel.app`

3. **Deployment Order:**  
   Always deploy `mfe2` (REMOTE) **before** `mfe1` (HOST) to ensure the latest `remoteEntry.js` is available.

4. **Monorepo Caching:**  
   Vercel automatically caches `node_modules`. If you encounter stale dependency issues, use the **Clear Build Cache** option in Vercel Dashboard.

---

## 📚 Additional Resources

- **Rsbuild Output Directory:** By default, Rsbuild outputs to `dist/` (as seen in your package.json `build` scripts)
- **Module Federation Docs:** [https://module-federation.io/](https://module-federation.io/)
- **Vercel Monorepo Guide:** [https://vercel.com/docs/monorepos](https://vercel.com/docs/monorepos)

---

**🎉 You're all set!** Both micro-frontends should now be deployed and communicating correctly via Module Federation on Vercel.
