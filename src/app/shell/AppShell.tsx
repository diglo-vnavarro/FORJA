import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import { ForjaLogo } from "@/components/ui/ForjaLogo";

const navItems: { to: string; label: string; icon: ForjaIconName; end?: boolean }[] = [
  { to: "/", label: "Dashboard", icon: "competence", end: true },
  { to: "/exercises", label: "Ejercicios", icon: "strength" },
  { to: "/sessions", label: "Sesiones", icon: "time" },
  { to: "/planning", label: "Programación", icon: "sets" },
  { to: "/athletes", label: "Atletas", icon: "bodyweight" },
  { to: "/library", label: "Biblioteca", icon: "observe" },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    <header className="app-bar">
      <NavLink to="/" className="brand-link" aria-label="FORJA, ir al dashboard"><ForjaLogo variant="lockup" size="md" inverse /></NavLink>
      <button className="menu-button" type="button" aria-label={open ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <div className="profile-placeholder" aria-label="Perfil no configurado"><span aria-hidden="true">VN</span><div><strong>Entrenador</strong><small>Perfil en preparación</small></div></div>
    </header>
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
      <nav aria-label="Navegación principal">{navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}><ForjaIcon name={item.icon} size={20} /><span>{item.label}</span></NavLink>)}</nav>
      <p className="sidebar-note">Base de producto <strong>v0.1</strong></p>
    </aside>
    {open && <button className="nav-scrim" aria-label="Cerrar navegación" onClick={() => setOpen(false)} />}
    <main className="app-content" id="main-content"><Outlet /></main>
  </div>;
}
