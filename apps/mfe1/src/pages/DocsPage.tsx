import React, { Suspense, lazy } from "react";

// Lazy load the Docusaurus app from the remote
const DocusaurusApp = lazy(() =>
  import("docs_app/App").catch((err) => {
    console.error("Failed to load Docusaurus remote:", err);
    return { default: () => <ErrorFallback /> };
  })
);

const ErrorFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen p-8">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Failed to Load Documentation</h2>
      <p className="text-gray-600 mb-4">
        Unable to connect to the documentation server.
      </p>
      <p className="text-sm text-gray-500">
        Make sure the docs app is running on port 3003.
      </p>
    </div>
  </div>
);

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading documentation...</p>
    </div>
  </div>
);

/**
 * DocsPage component that hosts the Docusaurus app as a remote module
 * This component is mounted on the /docs/* route in mfe1
 */
const DocsPage: React.FC = () => {
  return (
    <div className="docs-container w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <DocusaurusApp />
      </Suspense>
    </div>
  );
};

export default DocsPage;
