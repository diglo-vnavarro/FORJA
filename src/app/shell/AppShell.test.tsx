import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { THEME_STORAGE_KEY } from "@/app/theme";

describe("AppShell with Theme Toggle (DEC-B / F1-07)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the navigation and the theme toggle button", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /navegación principal/i })).toBeInTheDocument();

    const toggleBtn = screen.getByRole("button", { name: /cambiar a tema (oscuro|claro)/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it("toggles theme when clicking the theme button and persists preference", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );

    const toggleBtn = screen.getByRole("button", { name: /cambiar a tema oscuro/i });
    expect(toggleBtn).toBeInTheDocument();

    await user.click(toggleBtn);

    // After clicking from default light/system to dark
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    const toggleBtnDark = screen.getByRole("button", { name: /cambiar a tema claro/i });
    expect(toggleBtnDark).toBeInTheDocument();

    await user.click(toggleBtnDark);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
