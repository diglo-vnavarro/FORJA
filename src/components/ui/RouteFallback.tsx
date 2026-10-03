import { ForjaLogo } from "@/components/ui/ForjaLogo";

export function RouteFallback() {
  return <div className="route-fallback" role="status" aria-live="polite"><ForjaLogo variant="lockup" size="md" /><span>Cargando FORJA…</span></div>;
}
