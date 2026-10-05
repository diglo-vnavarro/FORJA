import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { UpdatePrompt } from "./UpdatePrompt";

describe("UpdatePrompt component", () => {
  it("renders nothing when no update is available", () => {
    const { container } = render(<UpdatePrompt isUpdateAvailable={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders accessible update banner when update is available", () => {
    render(<UpdatePrompt isUpdateAvailable={true} />);

    const banner = screen.getByRole("status");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByText("Hay una nueva versión de FORJA disponible."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Actualizar ahora" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Más tarde" }),
    ).toBeInTheDocument();
  });

  it("calls onApplyUpdate when clicking Actualizar ahora", async () => {
    const user = userEvent.setup();
    const onApplyUpdate = vi.fn();

    render(
      <UpdatePrompt isUpdateAvailable={true} onApplyUpdate={onApplyUpdate} />,
    );

    const updateButton = screen.getByRole("button", {
      name: "Actualizar ahora",
    });
    await user.click(updateButton);

    expect(onApplyUpdate).toHaveBeenCalledTimes(1);
  });

  it("calls onDismissUpdate when clicking Más tarde", async () => {
    const user = userEvent.setup();
    const onDismissUpdate = vi.fn();

    render(
      <UpdatePrompt
        isUpdateAvailable={true}
        onDismissUpdate={onDismissUpdate}
      />,
    );

    const dismissButton = screen.getByRole("button", { name: "Más tarde" });
    await user.click(dismissButton);

    expect(onDismissUpdate).toHaveBeenCalledTimes(1);
  });
});
