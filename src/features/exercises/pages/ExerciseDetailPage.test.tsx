import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ExerciseDetailPage } from "./ExerciseDetailPage";

describe("ExerciseDetailPage (F1-08: Revelación progresiva)", () => {
  it("renders the EX-002 prescription, objective and stop criteria on the default tab", () => {
    render(
      <MemoryRouter initialEntries={["/exercises/EX-002"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Encabezado y resumen del ejercicio
    expect(screen.getByRole("heading", { name: "Sentadilla goblet" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Resumen del ejercicio" })).toBeInTheDocument();

    // Pestañas de revelación progresiva
    const tabPrescription = screen.getByRole("tab", { name: /Prescripción y uso/i });
    expect(tabPrescription).toHaveAttribute("aria-selected", "true");

    // Objetivo, Dosis/Prescripción y Criterios de parada accesibles de forma inmediata
    expect(screen.getByRole("heading", { name: "Objetivo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prescripción" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Criterios de parada" })).toBeInTheDocument();
    expect(screen.getByText(/No constituye una receta universal/i)).toBeInTheDocument();
  });

  it("permite cambiar entre pestañas para revelar la técnica y las modificaciones", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/exercises/EX-002"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const tabTechnique = screen.getByRole("tab", { name: /Técnica y claves/i });
    const tabRelations = screen.getByRole("tab", { name: /Modificaciones y criterio/i });

    // Cambiar a la pestaña de técnica
    await user.click(tabTechnique);
    expect(tabTechnique).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "Cómo realizarla" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Coaching" })).toBeInTheDocument();

    // Cambiar a la pestaña de modificaciones y red de decisiones
    await user.click(tabRelations);
    expect(tabRelations).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "Modificar la tarea" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Regresiones" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Progresiones" })).toBeInTheDocument();
  });

  it("soporta navegación por teclado entre pestañas con flechas derecha e izquierda", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/exercises/EX-002"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const tabPrescription = screen.getByRole("tab", { name: /Prescripción y uso/i });
    tabPrescription.focus();
    expect(tabPrescription).toHaveFocus();

    // Flecha derecha avanza a la siguiente pestaña
    await user.keyboard("{ArrowRight}");
    const tabTechnique = screen.getByRole("tab", { name: /Técnica y claves/i });
    expect(tabTechnique).toHaveFocus();
    expect(tabTechnique).toHaveAttribute("aria-selected", "true");
  });

  it("renders variable overview data and the integrated pilot media", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/exercises/EX-013"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("region", { name: "Resumen del ejercicio" })).toHaveTextContent("Control");
    expect(screen.getByAltText(/Plancha frontal sobre antebrazos y pies/i)).toBeInTheDocument();
    expect(screen.queryByText("Carga", { selector: ".metric span" })).not.toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={["/exercises/EX-002"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByAltText(/Dos fases de una sentadilla goblet/i)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /Imagen en producción para Sentadilla goblet/i })).not.toBeInTheDocument();
  });

  it("renders integrated media for exercises outside the original pilot", () => {
    render(
      <MemoryRouter initialEntries={["/exercises/EX-003"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByAltText(/Dos fases de una bisagra de cadera sin carga/i)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /Imagen en producción para Bisagra de cadera/i })).not.toBeInTheDocument();
  });

  it("muestra estado vacío accesible con enlace al catálogo si el ejercicio no existe", () => {
    render(
      <MemoryRouter initialEntries={["/exercises/EX-999"]}>
        <Routes>
          <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Ejercicio no encontrado" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al catálogo" })).toBeInTheDocument();
  });
});

it("allows consulting glossary terms in-place without leaving the exercise sheet", async () => {
  const { default: userEvent } = await import("@testing-library/user-event");
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/exercises/EX-002"]}>
      <Routes>
        <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("region", { name: "Glosario metodológico" })).toBeInTheDocument();
  const termChip = screen.getByRole("button", { name: /Consultar definición de.*RIR/i });
  expect(termChip).toBeInTheDocument();

  await user.click(termChip);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /RIR — Repeticiones en reserva/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cerrar glosario" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Cerrar glosario" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

