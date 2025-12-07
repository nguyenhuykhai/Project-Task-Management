import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./App.css";
import { MainAppRoutes } from "./router/routes/main-app-routes";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainAppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
