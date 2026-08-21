import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ExerciseDetailPage } from "./ExerciseDetailPage";

it("renders the EX-002 prescription and coaching content", () => {
  render(<MemoryRouter initialEntries={["/exercises/EX-002"]}><Routes><Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Sentadilla goblet" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Prescripción" })).toBeInTheDocument();
  expect(screen.getByText(/No constituye una receta universal/i)).toBeInTheDocument();
});

it("renders variable overview data and the integrated pilot media", () => {
  const { unmount } = render(<MemoryRouter initialEntries={["/exercises/EX-013"]}><Routes><Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByRole("region", { name: "Resumen del ejercicio" })).toHaveTextContent("Control");
  expect(screen.getByAltText(/Plancha frontal sobre antebrazos y pies/i)).toBeInTheDocument();
  expect(screen.queryByText("Carga", { selector: ".metric span" })).not.toBeInTheDocument();
  unmount();
  render(<MemoryRouter initialEntries={["/exercises/EX-002"]}><Routes><Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByAltText(/Dos fases de una sentadilla goblet/i)).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /Imagen en producción para Sentadilla goblet/i })).not.toBeInTheDocument();
});

it("renders integrated media for exercises outside the original pilot", () => {
  render(<MemoryRouter initialEntries={["/exercises/EX-003"]}><Routes><Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} /></Routes></MemoryRouter>);
  expect(screen.getByAltText(/Dos fases de una bisagra de cadera sin carga/i)).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /Imagen en producción para Bisagra de cadera/i })).not.toBeInTheDocument();
});
