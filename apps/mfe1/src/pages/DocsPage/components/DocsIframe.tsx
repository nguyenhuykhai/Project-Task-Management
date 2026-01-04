import type { Theme } from "@/components/providers/theme-provider";
import React, { useRef, useEffect } from "react";

interface DocsIframeProps {
  currentTheme: Theme;
}

const DOCS_BASE_URL =
  import.meta.env.VITE_DOCS_BASE_URL || "http://localhost:3000";

export const DocsIframe: React.FC<DocsIframeProps> = ({ currentTheme }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper function to send message
  const sendThemeToIframe = (theme: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ theme }, DOCS_BASE_URL);
    }
  };

  // 1. Sync when 'currentTheme' prop changes
  useEffect(() => {
    sendThemeToIframe(currentTheme);
  }, [currentTheme]);

  // 2. Sync immediately when Iframe loads (Initial Handshake)
  const handleIframeLoad = () => {
    sendThemeToIframe(currentTheme);
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 60px)" }}>
      <iframe
        ref={iframeRef}
        src={`${DOCS_BASE_URL}/intro`}
        title="Documentation"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
};
