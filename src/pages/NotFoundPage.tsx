import { Link } from "react-router-dom"; import { EmptyState } from "@/components/ui/EmptyState";
export function NotFoundPage() { return <div className="page"><EmptyState title="Página no encontrada" description="La ruta solicitada no existe." /><Link className="button" to="/">Ir al dashboard</Link></div>; }
