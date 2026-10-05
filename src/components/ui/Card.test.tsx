import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card, CardBody, CardFooter, CardHeader, CardKicker, CardTitle } from "./Card";

describe("Card component (F1-05)", () => {
  it("renderiza con el rol semántico article por defecto y expone su estructura", () => {
    render(
      <Card aria-labelledby="card-title">
        <CardHeader>
          <CardKicker>Fuerza general</CardKicker>
          <CardTitle as="h2">Sentadilla Goblet</CardTitle>
        </CardHeader>
        <CardBody>
          <p>Patrón básico de rodilla dominante.</p>
        </CardBody>
        <CardFooter>
          <span>EX-002</span>
        </CardFooter>
      </Card>,
    );

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(screen.getByText("Sentadilla Goblet")).toBeInTheDocument();
    expect(screen.getByText("Fuerza general")).toBeInTheDocument();
    expect(screen.getByText("EX-002")).toBeInTheDocument();
  });

  it("acepta foco de teclado e interactividad cuando isInteractive=true", async () => {
    const user = userEvent.setup();
    const handleKeyDown = vi.fn();

    render(
      <Card isInteractive onKeyDown={handleKeyDown} aria-label="Tarjeta interactiva">
        <CardBody>
          <p>Contenido clicable</p>
        </CardBody>
      </Card>,
    );

    const card = screen.getByRole("article", { name: "Tarjeta interactiva" });
    expect(card).toHaveAttribute("tabindex", "0");

    card.focus();
    expect(card).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleKeyDown).toHaveBeenCalled();
  });
});
