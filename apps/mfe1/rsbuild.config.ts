import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "@module-federation/enhanced";

const buildRemotes = () => {
  const remotes: Record<string, string> = {};
  const mfe2Url = process.env.VITE_MFE2_BASE_URL + "/remoteEntry.js";
  const mfe2Scope = process.env.VITE_MFE2_SCOPE || "remote";
  remotes[mfe2Scope] = `${mfe2Scope}@${mfe2Url}`;

  // Add docs app remote
  const docsUrl = process.env.VITE_DOCS_BASE_URL || "http://localhost:3003";
  remotes["docs_app"] = `docs_app@${docsUrl}/remoteEntry.js`;

  return remotes;
};

export default defineConfig({
  server: {
    port: 3001,
    host: "localhost", // Add this
    cors: true, // Add this
  },
  dev: {
    assetPrefix: process.env.VITE_MFE1_BASE_URL || "http://localhost:3001",
  },
  output: {
    assetPrefix: process.env.VITE_MFE1_BASE_URL || "http://localhost:3001",
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "host",
      remotes: buildRemotes(),
      exposes: {
        "./NotFound": "./src/components/common/templates/NotFound",
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
      },
      bridge: {
        enableBridgeRouter: true,
      },
      dts: false,
    }),
  ],
});
