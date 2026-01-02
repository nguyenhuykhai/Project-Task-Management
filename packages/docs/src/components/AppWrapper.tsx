import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

/**
 * AppWrapper component that exports the Docusaurus app for Module Federation
 * This component is exposed as a remote module and can be consumed by other apps
 */
const AppWrapper: React.FC = () => {
  return (
    <BrowserOnly fallback={<div>Loading documentation...</div>}>
      {() => {
        // Import the Docusaurus app component dynamically
        // This ensures proper hydration and SSR handling
        const App = require("@generated/docusaurus.config").default;
        return <App />;
      }}
    </BrowserOnly>
  );
};

export default AppWrapper;
