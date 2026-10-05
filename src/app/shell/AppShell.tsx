import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import { ForjaLogo } from "@/components/ui/ForjaLogo";
import { UpdatePrompt } from "@/app/shell/UpdatePrompt";
import { GlobalSearch } from "@/features/search/components/GlobalSearch";
import { useTheme } from "@/app/theme";

interface NavItemConfig {
  to: string;
  label: string;
  icon: ForjaIconName;
  end?: boolean;
}

const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  { to: "/", label: "Dashboard", icon: "competence", end: true },
  { to: "/exercises", label: "Ejercicios", icon: "strength" },
  { to: "/sessions", label: "Sesiones", icon: "time" },
];

const SECONDARY_NAV_ITEMS: NavItemConfig[] = [
  { to: "/planning", label: "Programación", icon: "sets" },
  { to: "/athletes", label: "Atletas", icon: "bodyweight" },
  { to: "/library", label: "Biblioteca", icon: "observe" },
];

const ALL_NAV_ITEMS: NavItemConfig[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
];

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const closeAllNav = () => {
    setSidebarOpen(false);
    setMoreSheetOpen(false);
  };

  // Cierra el panel "Más" o el sidebar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (moreSheetOpen) setMoreSheetOpen(false);
        if (sidebarOpen) setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moreSheetOpen, sidebarOpen]);

  return (
    <div className="app-shell">
      {/* Enlace de accesibilidad para saltar directamente al contenido */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Barra superior de aplicación */}
      <header className="app-bar">
        <NavLink to="/" className="brand-link" aria-label="FORJA, ir al inicio">
          <ForjaLogo variant="lockup" size="md" inverse />
        </NavLink>

        <GlobalSearch />

        <button
          className="menu-button"
          type="button"
          aria-label={sidebarOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span /><span /><span />
        </button>

        <div className="app-bar-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            <ForjaIcon name={isDark ? "themeLight" : "themeDark"} size={20} />
          </button>
          <div className="profile-placeholder" aria-label="Perfil no configurado">
            <span aria-hidden="true"><ForjaIcon name="bodyweight" size={20} /></span>
            <div>
              <strong>Entrenador</strong>
              <small>Perfil en preparación</small>
            </div>
          </div>
        </div>
      </header>

      {/* Aviso accesible de actualización PWA */}
      <UpdatePrompt />

      {/* Barra lateral fija para tablet y escritorio (>= 768px) */}
      <aside
        id="app-sidebar"
        className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}
      >
        <nav aria-label="Navegación principal">
          {ALL_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeAllNav}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item--active" : ""}`
              }
            >
              <ForjaIcon name={item.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-note">
          Base de producto <strong>v0.1</strong>
        </p>
      </aside>

      {/* Scrim para cerrar navegación lateral en móvil */}
      {sidebarOpen && (
        <button
          className="nav-scrim"
          type="button"
          aria-label="Cerrar navegación lateral"
          onClick={closeAllNav}
        />
      )}

      {/* Contenido principal de la página */}
      <main className="app-content" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Barra de navegación inferior adaptativa para móvil (< 768px) */}
      <nav
        className="mobile-bottom-nav"
        role="navigation"
        aria-label="Navegación móvil"
      >
        <ul className="mobile-bottom-nav__list">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <li key={item.to} className="mobile-bottom-nav__item">
              <NavLink
                to={item.to}
                end={item.end}
                onClick={closeAllNav}
                className={({ isActive }) =>
                  `mobile-bottom-nav__link ${isActive ? "mobile-bottom-nav__link--active" : ""}`
                }
              >
                <ForjaIcon name={item.icon} size={22} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Botón para desplegar las secciones secundarias */}
          <li className="mobile-bottom-nav__item">
            <button
              type="button"
              className={`mobile-bottom-nav__link ${moreSheetOpen ? "mobile-bottom-nav__link--active" : ""}`}
              aria-label="Más secciones de navegación"
              aria-expanded={moreSheetOpen}
              aria-controls="mobile-more-sheet"
              onClick={() => setMoreSheetOpen(!moreSheetOpen)}
            >
              <span className="mobile-bottom-nav__more-icon" aria-hidden="true">
                <span /><span /><span />
              </span>
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Hoja modal inferior para opciones secundarias en móvil */}
      {moreSheetOpen && (
        <div className="mobile-more-sheet-portal">
          <div
            className="mobile-more-sheet__scrim"
            onClick={closeAllNav}
            aria-hidden="true"
            data-testid="mobile-more-scrim"
          />
          <section
            id="mobile-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Opciones adicionales de navegación"
            className="mobile-more-sheet"
          >
            <div className="mobile-more-sheet__handle" aria-hidden="true" />
            <div className="mobile-more-sheet__header">
              <h2 className="mobile-more-sheet__title">Más secciones</h2>
              <button
                type="button"
                className="mobile-more-sheet__close"
                onClick={closeAllNav}
                aria-label="Cerrar opciones"
              >
                &times;
              </button>
            </div>

            <nav className="mobile-more-sheet__nav" aria-label="Secciones secundarias">
              {SECONDARY_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeAllNav}
                  className={({ isActive }) =>
                    `mobile-more-sheet__link ${isActive ? "mobile-more-sheet__link--active" : ""}`
                  }
                >
                  <ForjaIcon name={item.icon} size={22} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </section>
        </div>
      )}
    </div>
  );
}
