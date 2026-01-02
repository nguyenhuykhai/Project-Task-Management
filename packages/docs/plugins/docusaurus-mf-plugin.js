const { ModuleFederationPlugin } = require("webpack").container;

/**
 * Docusaurus plugin to configure Module Federation
 * This allows the docs app to be consumed as a remote by other micro-frontends
 */
module.exports = function docusaurusModuleFederationPlugin() {
  return {
    name: "docusaurus-module-federation-plugin",
    
    configureWebpack(config, isServer) {
      // Only apply Module Federation to client-side builds
      if (isServer) {
        return {};
      }

      return {
        plugins: [
          new ModuleFederationPlugin({
            name: "docs_app",
            filename: "remoteEntry.js",
            exposes: {
              "./App": "./src/components/AppWrapper.tsx",
            },
            shared: {
              react: {
                singleton: true,
                requiredVersion: false,
                eager: true, // Load immediately to avoid async chunk loading issues
              },
              "react-dom": {
                singleton: true,
                requiredVersion: false,
                eager: true, // Load immediately to avoid async chunk loading issues
              },
            },
          }),
        ],
        output: {
          ...config.output,
          publicPath: "auto",
        },
      };
    },
  };
};
