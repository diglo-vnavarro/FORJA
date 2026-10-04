import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { registerServiceWorker } from "@/app/pwa";
import "@fontsource-variable/inter";
import "@/design-system/forja/src/styles/index.css";
import "@/styles/global.css";

if (import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void registerServiceWorker();
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RouterProvider router={router} /></StrictMode>,
);
