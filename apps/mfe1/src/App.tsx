import { PortalContainerProvider } from "@repo/ui";
import { useState } from "react";
import { BrowserRouter } from "react-router";
import { MainAppRoutes } from "./router/routes/main-app-routes";

function App() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div id="mfe1-root" ref={setContainer}>
      <PortalContainerProvider container={container}>
        <BrowserRouter>
          <MainAppRoutes />
        </BrowserRouter>
      </PortalContainerProvider>
    </div>
  );
}

export default App;
