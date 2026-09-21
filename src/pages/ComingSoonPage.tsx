import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
const labels: Record<string, string> = { sessions: "Sesiones", planning: "Programación", athletes: "Atletas", library: "Biblioteca" };
export function ComingSoonPage() { const key = useLocation().pathname.slice(1); const title = labels[key] ?? "Sección"; return <div className="page"><PageHeader eyebrow="Arquitectura preparada" title={title} description="Esta ruta forma parte de la navegación base de FORJA." /><EmptyState title="Próximamente" description="La funcionalidad se desarrollará en una fase posterior. No hay datos simulados en esta sección." /></div>; }
