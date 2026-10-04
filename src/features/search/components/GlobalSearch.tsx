import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { searchCatalog } from "@/features/search/data/searchCatalog";
import type { SearchItemKind, SearchResult } from "@/features/search/domain/searchIndex";

type FilterType = "all" | SearchItemKind;

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOpen = () => {
    setQuery("");
    setActiveIndex(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  // Atajo de teclado global: Ctrl+K / Cmd+K o barra diagonal (/)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      } else if (e.key === "/" && !isInput && !isOpen) {
        e.preventDefault();
        handleOpen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Bloqueo de scroll y enfoque del campo de búsqueda al abrir
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Resultados de búsqueda
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const kindFilter = filter === "all" ? undefined : [filter];
    return searchCatalog(query, kindFilter);
  }, [query, filter]);

  // Agrupación por tipo de recurso
  const groupedResults = useMemo(() => {
    const groups: {
      exercises: SearchResult[];
      sessions: SearchResult[];
      glossary: SearchResult[];
    } = {
      exercises: [],
      sessions: [],
      glossary: [],
    };

    for (const r of results) {
      if (r.item.kind === "exercise") groups.exercises.push(r);
      else if (r.item.kind === "session") groups.sessions.push(r);
      else if (r.item.kind === "glossary") groups.glossary.push(r);
    }

    return groups;
  }, [results]);

  // Lista plana para navegación secuencial con teclado
  const flatResults = results;

  // Manejo de teclado dentro del diálogo (flechas, Enter, Escape)
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatResults.length > 0) {
        setActiveIndex((prev) => (prev + 1) % flatResults.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatResults.length > 0) {
        setActiveIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatResults[activeIndex]) {
        handleSelect(flatResults[activeIndex].item.url);
      }
    }
  };

  const handleSelect = (url: string) => {
    handleClose();
    navigate(url);
  };

  const isMac = typeof navigator !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);

  return (
    <>
      {/* Botón trigger en la cabecera (escritorio) */}
      <button
        type="button"
        className="global-search-trigger"
        onClick={handleOpen}
        aria-label="Abrir buscador global"
      >
        <ForjaIcon name="search" size={16} className="global-search-trigger__icon" />
        <span className="global-search-trigger__text">Buscar en FORJA...</span>
        <kbd className="global-search-trigger__kbd">{isMac ? "⌘K" : "Ctrl+K"}</kbd>
      </button>

      {/* Botón trigger en cabecera para móvil */}
      <button
        type="button"
        className="global-search-mobile-trigger"
        onClick={handleOpen}
        aria-label="Buscar en FORJA"
      >
        <ForjaIcon name="search" size={20} />
      </button>

      {/* Diálogo modal / Pantalla completa en móvil */}
      {isOpen && (
        <div
          className="global-search-overlay"
          onClick={handleClose}
          role="presentation"
        >
          <div
            className="global-search-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda global"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            <div className="global-search-modal__header">
              <ForjaIcon name="search" size={20} className="global-search-modal__search-icon" />
              <input
                ref={inputRef}
                type="search"
                className="global-search-modal__input"
                placeholder="Buscar por nombre, alias, patrón, material, término..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                aria-label="Término de búsqueda"
              />
              <button
                type="button"
                className="global-search-modal__close-btn"
                onClick={handleClose}
                aria-label="Cerrar búsqueda"
              >
                <ForjaIcon name="close" size={20} />
              </button>
            </div>

            {/* Pestañas de filtrado */}
            <div className="global-search-modal__filters" role="tablist" aria-label="Filtrar por tipo">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                className={`global-search-filter-tab ${filter === "all" ? "global-search-filter-tab--active" : ""}`}
                onClick={() => {
                  setFilter("all");
                  setActiveIndex(0);
                }}
              >
                Todos
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "exercise"}
                className={`global-search-filter-tab ${filter === "exercise" ? "global-search-filter-tab--active" : ""}`}
                onClick={() => {
                  setFilter("exercise");
                  setActiveIndex(0);
                }}
              >
                Ejercicios
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "session"}
                className={`global-search-filter-tab ${filter === "session" ? "global-search-filter-tab--active" : ""}`}
                onClick={() => {
                  setFilter("session");
                  setActiveIndex(0);
                }}
              >
                Sesiones
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "glossary"}
                className={`global-search-filter-tab ${filter === "glossary" ? "global-search-filter-tab--active" : ""}`}
                onClick={() => {
                  setFilter("glossary");
                  setActiveIndex(0);
                }}
              >
                Glosario
              </button>
            </div>

            {/* Cuerpo de resultados */}
            <div
              className="global-search-modal__body"
              ref={resultsContainerRef}
              role="region"
              aria-label="Resultados de búsqueda"
            >
              {!query.trim() && (
                <div className="global-search-hint">
                  <p className="global-search-hint__text">
                    Escribe para buscar en la metodología:
                  </p>
                  <div className="global-search-hint__chips">
                    <button type="button" onClick={() => setQuery("sentadilla")}>sentadilla</button>
                    <button type="button" onClick={() => setQuery("mancuerna")}>mancuerna</button>
                    <button type="button" onClick={() => setQuery("dominante de rodilla")}>dominante de rodilla</button>
                    <button type="button" onClick={() => setQuery("1RM")}>1RM</button>
                    <button type="button" onClick={() => setQuery("SES-001")}>SES-001</button>
                  </div>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="global-search-empty">
                  <p>No se encontraron resultados para <strong>«{query}»</strong>.</p>
                  <small>Intenta buscar por patrón de movimiento, capacidad física o material.</small>
                </div>
              )}

              {query.trim() && results.length > 0 && (
                <div className="global-search-results-list" role="listbox">
                  {filter === "all" ? (
                    <>
                      {groupedResults.exercises.length > 0 && (
                        <div className="global-search-group">
                          <h4 className="global-search-group__title">
                            Ejercicios ({groupedResults.exercises.length})
                          </h4>
                          {groupedResults.exercises.map((res) => {
                            const itemIndex = flatResults.indexOf(res);
                            const isActive = itemIndex === activeIndex;
                            return (
                              <SearchItemRow
                                key={res.item.id}
                                result={res}
                                isActive={isActive}
                                onSelect={() => handleSelect(res.item.url)}
                              />
                            );
                          })}
                        </div>
                      )}

                      {groupedResults.sessions.length > 0 && (
                        <div className="global-search-group">
                          <h4 className="global-search-group__title">
                            Sesiones ({groupedResults.sessions.length})
                          </h4>
                          {groupedResults.sessions.map((res) => {
                            const itemIndex = flatResults.indexOf(res);
                            const isActive = itemIndex === activeIndex;
                            return (
                              <SearchItemRow
                                key={res.item.id}
                                result={res}
                                isActive={isActive}
                                onSelect={() => handleSelect(res.item.url)}
                              />
                            );
                          })}
                        </div>
                      )}

                      {groupedResults.glossary.length > 0 && (
                        <div className="global-search-group">
                          <h4 className="global-search-group__title">
                            Glosario ({groupedResults.glossary.length})
                          </h4>
                          {groupedResults.glossary.map((res) => {
                            const itemIndex = flatResults.indexOf(res);
                            const isActive = itemIndex === activeIndex;
                            return (
                              <SearchItemRow
                                key={res.item.id}
                                result={res}
                                isActive={isActive}
                                onSelect={() => handleSelect(res.item.url)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    results.map((res, idx) => (
                      <SearchItemRow
                        key={res.item.id}
                        result={res}
                        isActive={idx === activeIndex}
                        onSelect={() => handleSelect(res.item.url)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Pie de diálogo con atajos */}
            <div className="global-search-modal__footer">
              <span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span>
              <span><kbd>Enter</kbd> seleccionar</span>
              <span><kbd>Esc</kbd> cerrar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchItemRow({
  result,
  isActive,
  onSelect,
}: {
  result: SearchResult;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { item } = result;

  const kindLabel =
    item.kind === "exercise" ? "Ejercicio" : item.kind === "session" ? "Sesión" : "Glosario";

  const kindBadgeClass =
    item.kind === "exercise"
      ? "badge--blue"
      : item.kind === "session"
      ? "badge--emerald"
      : "badge--amber";

  return (
    <div
      role="option"
      aria-selected={isActive}
      className={`global-search-item ${isActive ? "global-search-item--active" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
    >
      <div className="global-search-item__header">
        <span className={`badge ${kindBadgeClass}`}>{kindLabel}</span>
        <strong className="global-search-item__title">{item.title}</strong>
        {item.subtitle && <span className="global-search-item__subtitle">{item.subtitle}</span>}
      </div>

      {item.description && (
        <p className="global-search-item__desc">{item.description}</p>
      )}

      {(item.pattern || item.equipment.length > 0 || item.capabilities.length > 0) && (
        <div className="global-search-item__meta">
          {item.pattern && <span className="meta-tag">{item.pattern}</span>}
          {item.equipment.slice(0, 3).map((eq) => (
            <span key={eq} className="meta-tag meta-tag--alt">{eq}</span>
          ))}
          {item.capabilities.slice(0, 2).map((cap) => (
            <span key={cap} className="meta-tag">{cap}</span>
          ))}
        </div>
      )}
    </div>
  );
}
