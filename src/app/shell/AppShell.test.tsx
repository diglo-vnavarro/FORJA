import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { notifyUpdateAvailable } from "@/app/pwa";
import { THEME_STORAGE_KEY } from "@/app/theme";
import { AppShell } from "./AppShell";

describe("Adaptive AppShell component with Theme Toggle and PWA UpdatePrompt (F1-06 / F1-07 / F2-03)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders a neutral profile placeholder without fixed personal initials", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    const placeholder = screen.getByLabelText("Perfil no configurado");
    expect(placeholder).toBeInTheDocument();
    expect(screen.queryByText("VN")).not.toBeInTheDocument();

    const icon = placeholder.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(container.querySelector(".profile-placeholder > span")?.textContent).toBe("");
  });

  it("contiene el enlace accesible para saltar al contenido principal", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    const skipLink = screen.getByRole("link", { name: "Saltar al contenido principal" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");

    const mainContent = screen.getByRole("main");
    expect(mainContent).toHaveAttribute("id", "main-content");
    expect(mainContent).toHaveAttribute("tabindex", "-1");
  });

  it("renderiza la navegación lateral para escritorio y la barra inferior para móvil", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    // Navegación de escritorio/tableta
    const desktopNav = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(desktopNav).toBeInTheDocument();

    // Navegación inferior adaptativa de móvil
    const mobileNav = screen.getByRole("navigation", { name: "Navegación móvil" });
    expect(mobileNav).toBeInTheDocument();
  });

  it("es navegable mediante teclado y el enlace de salto puede recibir foco", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    const skipLink = screen.getByRole("link", { name: "Saltar al contenido principal" });
    skipLink.focus();
    expect(skipLink).toHaveFocus();
  });

  it("permite abrir y cerrar el panel Más en la navegación móvil con teclado y clic", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    const moreButton = screen.getByRole("button", { name: "Más secciones de navegación" });
    expect(moreButton).toHaveAttribute("aria-expanded", "false");

    // Abrir con clic o enter
    await user.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    const dialog = screen.getByRole("dialog", { name: "Opciones adicionales de navegación" });
    expect(dialog).toBeInTheDocument();

    // Comprobar enlaces secundarios dentro del diálogo
    const dialogScope = within(dialog);
    expect(dialogScope.getByRole("link", { name: /Programación/i })).toBeInTheDocument();
    expect(dialogScope.getByRole("link", { name: /Atletas/i })).toBeInTheDocument();
    expect(dialogScope.getByRole("link", { name: /Biblioteca/i })).toBeInTheDocument();

    // Cerrar con Escape
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the theme toggle button and toggles theme on click", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell />
      </MemoryRouter>,
    );

    const toggleBtn = screen.getByRole("button", { name: /cambiar a tema (oscuro|claro)/i });
    expect(toggleBtn).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await user.click(toggleBtn);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("displays UpdatePrompt when a new service worker update is notified", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
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
