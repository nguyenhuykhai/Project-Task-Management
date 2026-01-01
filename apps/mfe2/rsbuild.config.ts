import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "@module-federation/enhanced";

const buildRemotes = () => {
  const remotes: Record<string, string> = {};
  const mfe1Url = process.env.VITE_MFE1_BASE_URL + "/remoteEntry.js";
  const mfe1Scope = process.env.VITE_MFE1_SCOPE || "host";
  remotes[mfe1Scope] = `${mfe1Scope}@${mfe1Url}`;

  return remotes;
};

export default defineConfig({
  server: {
    port: 3002,
    host: "localhost", // Add this
    cors: true, // Add this
  },
  dev: {
    assetPrefix: process.env.VITE_MFE2_BASE_URL || "http://localhost:3002",
  },
  output: {
    assetPrefix: process.env.VITE_MFE2_BASE_URL || "http://localhost:3002",
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "remote",
      remotes: buildRemotes(),
      exposes: {
        "./Button": "./src/components/export-app",
      },
      filename: "remoteEntry.js",
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
