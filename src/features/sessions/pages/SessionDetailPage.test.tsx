import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SessionDetailPage } from "./SessionDetailPage";

it("renders SES-002 with linked exercise tasks and adaptations", () => {
  render(<MemoryRouter initialEntries={["/sessions/SES-002"]}><Routes><Route path="/sessions/:sessionId" element={<SessionDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Fuerza general con carga externa" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Sentadilla goblet" })).toHaveAttribute("href", "/exercises/EX-002");
  expect(screen.getByRole("heading", { name: "Adaptaciones globales" })).toBeInTheDocument();
  expect(screen.getByText(/dosis realizada puede diferir/i)).toBeInTheDocument();
});

it("states the contextual limit of the football-compatible session", () => {
  render(<MemoryRouter initialEntries={["/sessions/fuerza-breve-semana-futbol"]}><Routes><Route path="/sessions/:sessionId" element={<SessionDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByRole("heading", { name: /Fuerza breve compatible/i })).toBeInTheDocument();
  expect(screen.getByText(/no significa automáticamente apropiada/i)).toBeInTheDocument();
});
