import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AppShell } from "./AppShell";
import { notifyUpdateAvailable } from "@/app/pwa";

describe("AppShell component", () => {
  it("renders main navigation landmarks and links", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );

    const nav = screen.getByRole("navigation", {
      name: "Navegación principal",
    });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ejercicios" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sesiones" })).toBeInTheDocument();
  });

  it("displays UpdatePrompt when a new service worker update is notified", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );

    // Initial state: no update prompt
    expect(
      screen.queryByRole("status", {
        name: "Aviso de actualización de la aplicación",
      }),
    ).not.toBeInTheDocument();

    // Trigger update available notification
    act(() => {
      notifyUpdateAvailable({
        waiting: { postMessage: () => {} },
      } as unknown as ServiceWorkerRegistration);
    });

    expect(
      screen.getByRole("status", {
        name: "Aviso de actualización de la aplicación",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hay una nueva versión de FORJA disponible."),
    ).toBeInTheDocument();
  });
});
