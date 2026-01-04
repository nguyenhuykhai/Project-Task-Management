import { useTheme } from "@/components/providers/theme-provider";
import { LoaderTwo } from "@repo/ui";
import React, { Suspense } from "react";
import { DocsIframe } from "./components/DocsIframe";

const DocsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoaderTwo />}>
        <DocsIframe currentTheme={theme} />
      </Suspense>
    </div>
  );
};

export default DocsPage;
