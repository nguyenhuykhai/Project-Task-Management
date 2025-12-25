import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "@module-federation/enhanced";

const buildRemotes = () => {
  const remotes: Record<string, string> = {};
  const mfe2Url = process.env.VITE_MFE2_BASE_URL + "/remoteEntry.js";
  const mfe2Scope = process.env.VITE_MFE2_SCOPE || "remote";
  remotes[mfe2Scope] = `${mfe2Scope}@${mfe2Url}`;

  return remotes;
};

export default defineConfig({
  server: {
    port: 3001,
    host: "localhost", // Add this
    cors: true, // Add this
  },
  dev: {
    assetPrefix: "http://localhost:3001", // Add this
  },
  output: {
    assetPrefix: "http://localhost:3001", // Add this for production
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
