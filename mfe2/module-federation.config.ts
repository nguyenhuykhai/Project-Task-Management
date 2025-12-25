import { dependencies } from "@module-federation/enhanced";
import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";

export default createModuleFederationConfig({
  name: "remote",
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
});
