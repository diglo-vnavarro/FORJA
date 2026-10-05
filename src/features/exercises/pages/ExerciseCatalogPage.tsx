import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput, SelectFilter } from "@/components/ui/FormControls";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { ExerciseCard } from "@/features/exercises/components/ExerciseCard";
import { exercises } from "@/features/exercises/data/exercises";
import { filterExercises, uniqueTerms } from "@/features/exercises/data/exerciseSelectors";

export function ExerciseCatalogPage() {
  const [query, setQuery] = useState("");
  const [capability, setCapability] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [movementPattern, setMovementPattern] = useState("all");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterExercises(exercises, {
        query,
        capability,
        equipment,
        movementPattern,
      }),
    [query, capability, equipment, movementPattern],
  );

  const capabilities = uniqueTerms(
    exercises.flatMap((exercise) => exercise.classification.capabilities),
  );
  const equipmentTerms = uniqueTerms(
    exercises.flatMap((exercise) => exercise.context.equipment),
  );
  const patterns = uniqueTerms(
    exercises.map((exercise) => exercise.classification.movementPattern),
  );

  const capabilityOptions = [
    { value: "all", label: "Todas las capacidades" },
    ...capabilities.map((item) => ({ value: item.id, label: item.label })),
  ];

  const equipmentOptions = [
    { value: "all", label: "Todo el equipamiento" },
    ...equipmentTerms.map((item) => ({ value: item.id, label: item.label })),
  ];

  const patternOptions = [
    { value: "all", label: "Todos los patrones" },
    ...patterns.map((item) => ({ value: item.id, label: item.label })),
  ];

  const activeFilterCount =
    (capability !== "all" ? 1 : 0) +
    (equipment !== "all" ? 1 : 0) +
    (movementPattern !== "all" ? 1 : 0);

  const resetFilters = () => {
    setCapability("all");
    setEquipment("all");
    setMovementPattern("all");
  };

  // Cierre de la hoja de filtros mediante tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFilterSheetOpen) {
        setIsFilterSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterSheetOpen]);

  return (
    <div className="page catalog-page">
      <PageHeader
        eyebrow="Biblioteca de movimiento"
        title="Ejercicios"
        description="Tareas organizadas para decidir qué usar, cómo prescribirlas y cuándo adaptarlas."
      />

      <div className="catalog-toolbar">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {/* Botón táctil para abrir filtros en hoja inferior en móvil */}
        <button
          type="button"
          className="mobile-filter-trigger"
          aria-haspopup="dialog"
          aria-expanded={isFilterSheetOpen}
          aria-controls="catalog-filters-sheet"
          onClick={() => setIsFilterSheetOpen(true)}
        >
          <ForjaIcon name="modifyTask" size={18} />
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <span
              className="mobile-filter-trigger__badge"
              aria-label={`${activeFilterCount} filtros activos`}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filtros visibles directamente en tableta y escritorio */}
      <section
        className="catalog-controls catalog-controls--desktop"
        aria-label="Filtros de catálogo"
      >
        <SelectFilter
          label="Capacidad"
          value={capability}
          onChange={(event) => setCapability(event.target.value)}
          options={capabilityOptions}
        />
        <SelectFilter
          label="Equipamiento"
          value={equipment}
          onChange={(event) => setEquipment(event.target.value)}
          options={equipmentOptions}
        />
        <SelectFilter
          label="Patrón"
          value={movementPattern}
          onChange={(event) => setMovementPattern(event.target.value)}
          options={patternOptions}
        />
      </section>

      {/* Hoja modal inferior para filtros en móvil */}
      {isFilterSheetOpen && (
        <div className="filter-sheet-portal">
          <div
            className="filter-sheet__scrim"
            onClick={() => setIsFilterSheetOpen(false)}
            aria-hidden="true"
            data-testid="filter-sheet-scrim"
          />
          <section
            id="catalog-filters-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-filters-title"
            className="filter-sheet"
          >
            <div className="filter-sheet__handle" aria-hidden="true" />
            <div className="filter-sheet__header">
              <h2 id="catalog-filters-title" className="filter-sheet__title">
                Filtros de ejercicios
              </h2>
              <button
                type="button"
                className="filter-sheet__close"
                onClick={() => setIsFilterSheetOpen(false)}
                aria-label="Cerrar filtros"
              >
                &times;
              </button>
            </div>

            <div className="filter-sheet__body">
              <SelectFilter
                label="Capacidad"
                value={capability}
                onChange={(event) => setCapability(event.target.value)}
                options={capabilityOptions}
              />
              <SelectFilter
                label="Equipamiento"
                value={equipment}
                onChange={(event) => setEquipment(event.target.value)}
                options={equipmentOptions}
              />
              <SelectFilter
                label="Patrón"
                value={movementPattern}
                onChange={(event) => setMovementPattern(event.target.value)}
                options={patternOptions}
              />
            </div>

            <div className="filter-sheet__footer">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="filter-sheet__reset"
                  onClick={resetFilters}
                >
                  Limpiar filtros
                </button>
              )}
              <button
                type="button"
                className="button button--primary filter-sheet__apply"
                onClick={() => setIsFilterSheetOpen(false)}
              >
                Ver {filtered.length}{" "}
                {filtered.length === 1 ? "resultado" : "resultados"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Resumen dinámico anunciado a tecnologías de asistencia */}
      <div className="result-summary" role="status" aria-live="polite">
        <strong>{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "ejercicio disponible" : "ejercicios disponibles"}
        <span>{exercises.length} fichas con documentación utilizable</span>
      </div>

      {filtered.length ? (
        <section className="exercise-grid" aria-label="Resultados">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.identity.id} exercise={exercise} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No hay coincidencias"
          description="Prueba con otro término o elimina alguno de los filtros."
        />
      )}
    </div>
  );
}
