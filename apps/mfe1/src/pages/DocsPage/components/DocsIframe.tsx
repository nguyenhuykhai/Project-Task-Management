import type { Theme } from "@/components/providers/theme-provider";
import React, { useRef, useEffect } from "react";

interface DocsIframeProps {
  currentTheme: Theme;
}

export const DocsIframe: React.FC<DocsIframeProps> = ({ currentTheme }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper function to send message
  const sendThemeToIframe = (theme: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { theme },
        "http://localhost:3003"
      );
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
        src="http://localhost:3003/intro"
        title="Documentation"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
};
