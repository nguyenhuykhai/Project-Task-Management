import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "@module-federation/enhanced";

export default defineConfig({
  server: {
    port: 3002,
    host: "localhost",
    cors: true,
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
      exposes: {
        "./RemoteApp": "./src/apps/main-app",
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
