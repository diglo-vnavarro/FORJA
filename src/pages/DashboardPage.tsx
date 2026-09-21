import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
const areas: { title: string; description: string; icon: ForjaIconName; to: string; ready: boolean }[] = [
  { title: "Ejercicios", description: "Explora tareas, prescripción y criterios de coaching.", icon: "strength", to: "/exercises", ready: true },
  { title: "Entrenamientos", description: "Construcción y seguimiento de sesiones.", icon: "time", to: "/sessions", ready: false },
  { title: "Programación", description: "Organización de estímulos y progresión.", icon: "sets", to: "/planning", ready: false },
  { title: "Atletas", description: "Contexto individual y toma de decisiones.", icon: "bodyweight", to: "/athletes", ready: false },
];
export function DashboardPage() { return <div className="page"><PageHeader eyebrow="Base de producto" title="Panel de trabajo" description="Un punto de partida claro para preparar, consultar y adaptar el entrenamiento." /><section className="dashboard-intro"><div><span className="status-dot" />Vertical slice disponible</div><h2>La biblioteca de ejercicios ya está preparada para revisión.</h2><p>Consulta el catálogo y abre la ficha de Sentadilla goblet para validar el primer patrón funcional de FORJA.</p><Link className="button" to="/exercises">Explorar ejercicios <span aria-hidden="true">→</span></Link></section><section className="dashboard-grid" aria-label="Áreas de FORJA">{areas.map((area) => <Link to={area.to} className="area-card" key={area.title}><ForjaIcon name={area.icon} size={28} /><div><span>{area.ready ? "Disponible" : "Próximamente"}</span><h2>{area.title}</h2><p>{area.description}</p></div></Link>)}</section></div>; }
