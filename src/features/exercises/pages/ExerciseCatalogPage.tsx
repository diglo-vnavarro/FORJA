import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput, SelectFilter } from "@/components/ui/FormControls";
import { ExerciseCard } from "@/features/exercises/components/ExerciseCard";
import { exercises } from "@/features/exercises/data/exercises";
import { filterExercises, uniqueTerms } from "@/features/exercises/data/exerciseSelectors";

export function ExerciseCatalogPage() {
  const [query, setQuery] = useState(""); const [capability, setCapability] = useState("all"); const [equipment, setEquipment] = useState("all"); const [movementPattern,setMovementPattern] = useState("all");
  const filtered = useMemo(() => filterExercises(exercises,{query,capability,equipment,movementPattern}), [query, capability, equipment,movementPattern]);
  const capabilities = uniqueTerms(exercises.flatMap((exercise) => exercise.classification.capabilities));
  const equipmentTerms = uniqueTerms(exercises.flatMap((exercise) => exercise.context.equipment));
  const patterns = uniqueTerms(exercises.map((exercise) => exercise.classification.movementPattern));
  return <div className="page"><PageHeader eyebrow="Biblioteca de movimiento" title="Ejercicios" description="Tareas organizadas para decidir qué usar, cómo prescribirlas y cuándo adaptarlas." />
    <section className="catalog-controls" aria-label="Búsqueda y filtros"><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} /><SelectFilter label="Capacidad" value={capability} onChange={(event) => setCapability(event.target.value)} options={[{ value: "all", label: "Todas" }, ...capabilities.map((item) => ({value:item.id,label:item.label}))]} /><SelectFilter label="Equipamiento" value={equipment} onChange={(event) => setEquipment(event.target.value)} options={[{ value: "all", label: "Todo" }, ...equipmentTerms.map((item) => ({value:item.id,label:item.label}))]} /><SelectFilter label="Patrón" value={movementPattern} onChange={(event) => setMovementPattern(event.target.value)} options={[{value:"all",label:"Todos"},...patterns.map((item)=>({value:item.id,label:item.label}))]} /></section>
    <div className="result-summary" aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "ejercicio" : "ejercicios"}<span>15 fichas con documentación utilizable</span></div>
    {filtered.length ? <section className="exercise-grid" aria-label="Resultados">{filtered.map((exercise) => <ExerciseCard key={exercise.identity.id} exercise={exercise} />)}</section> : <EmptyState title="No hay coincidencias" description="Prueba con otro término o elimina alguno de los filtros." />}
  </div>;
}
