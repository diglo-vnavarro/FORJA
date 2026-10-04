import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { glossaryTerms, getGlossaryTermBySlug } from "@/features/search/data/glossaryDocuments";
import type { GlossaryTerm } from "@/features/search/domain/glossary";
import { GlossaryDrawer } from "@/features/search/components/GlossaryDrawer";

export function GlossaryPage() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("all");
  const [manualSelectedTerm, setManualSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [dismissedSlug, setDismissedSlug] = useState<string | null>(null);

  const routeTerm = useMemo(() => {
    const targetSlug = slug || (typeof window !== "undefined" ? window.location.hash.replace("#", "") : "");
    if (!targetSlug || targetSlug === dismissedSlug) return null;
    return getGlossaryTermBySlug(targetSlug) ?? null;
  }, [slug, dismissedSlug]);

  const inspectedTerm = manualSelectedTerm ?? routeTerm;

  const handleCloseDrawer = () => {
    setManualSelectedTerm(null);
    const targetSlug = slug || (typeof window !== "undefined" ? window.location.hash.replace("#", "") : "");
    if (targetSlug) {
      setDismissedSlug(targetSlug);
    }
  };

  // Obtener letras disponibles
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const term of glossaryTerms) {
      const firstChar = term.title.charAt(0).toUpperCase();
      if (/[0-9]/.test(firstChar)) {
        letters.add("0–9");
      } else {
        letters.add(firstChar);
      }
    }
    return Array.from(letters).sort((a, b) => {
      if (a === "0–9") return -1;
      if (b === "0–9") return 1;
      return a.localeCompare(b);
    });
  }, []);

  // Términos filtrados
  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return glossaryTerms.filter((term) => {
      // Filtro por letra
      if (selectedLetter !== "all") {
        const firstChar = term.title.charAt(0).toUpperCase();
        if (selectedLetter === "0–9" && !/[0-9]/.test(firstChar)) return false;
        if (selectedLetter !== "0–9" && firstChar !== selectedLetter) return false;
      }

      // Filtro por búsqueda
      if (!q) return true;
      const matchTitle = term.title.toLowerCase().includes(q);
      const matchAcronym = term.acronym?.toLowerCase().includes(q);
      const matchSummary = term.summary.toLowerCase().includes(q);
      const matchDecision = term.decision?.toLowerCase().includes(q);
      return matchTitle || matchAcronym || matchSummary || matchDecision;
    });
  }, [searchQuery, selectedLetter]);

  return (
    <div className="page glossary-page">
      <nav className="breadcrumbs" aria-label="Migas de pan">
        <Link to="/">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span>Glosario</span>
      </nav>

      <header className="page-header">
        <div className="page-header__content">
          <p className="eyebrow">Fundamentación metodológica</p>
          <h1>Glosario de términos</h1>
          <p className="page-header__description">
            Términos técnicos, siglas y criterios metodológicos de FORJA para interpretar las cargas,
            ejercicios y adaptaciones de forma coherente.
          </p>
        </div>
      </header>

      {/* Barra de búsqueda y selector de letras */}
      <section className="glossary-controls">
        <div className="glossary-search-bar">
          <ForjaIcon name="search" size={20} className="glossary-search-bar__icon" />
          <input
            type="search"
            className="glossary-search-bar__input"
            placeholder="Buscar término, sigla o definición..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar en el glosario"
          />
          {searchQuery && (
            <button
              type="button"
              className="glossary-search-bar__clear"
              onClick={() => setSearchQuery("")}
              aria-label="Limpiar búsqueda"
            >
              <ForjaIcon name="close" size={16} />
            </button>
          )}
        </div>

        <div className="glossary-letters-bar" role="tablist" aria-label="Filtrar por letra inicial">
          <button
            type="button"
            role="tab"
            aria-selected={selectedLetter === "all"}
            className={`glossary-letter-btn ${selectedLetter === "all" ? "glossary-letter-btn--active" : ""}`}
            onClick={() => setSelectedLetter("all")}
          >
            Todos ({glossaryTerms.length})
          </button>
          {availableLetters.map((letter) => (
            <button
              key={letter}
              type="button"
              role="tab"
              aria-selected={selectedLetter === letter}
              className={`glossary-letter-btn ${selectedLetter === letter ? "glossary-letter-btn--active" : ""}`}
              onClick={() => setSelectedLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </section>

      {/* Listado de términos */}
      <section className="glossary-list" aria-label="Lista de términos">
        {filteredTerms.length === 0 ? (
          <div className="glossary-empty">
            <p>No se encontraron términos para los criterios seleccionados.</p>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedLetter("all");
              }}
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="glossary-grid">
            {filteredTerms.map((term) => (
              <article key={term.id} id={term.slug} className="glossary-card">
                <div className="glossary-card__header">
                  <div className="glossary-card__badges">
                    <span className="badge badge--blue">{term.category}</span>
                    {term.acronym && <span className="badge badge--amber">{term.acronym}</span>}
                  </div>
                  <button
                    type="button"
                    className="glossary-card__open-btn"
                    onClick={() => setManualSelectedTerm(term)}
                    aria-label={`Ver detalle completo de ${term.title}`}
                  >
                    <ForjaIcon name="observe" size={18} />
                  </button>
                </div>

                <h3 className="glossary-card__title">
                  <button
                    type="button"
                    className="glossary-card__title-btn"
                    onClick={() => setManualSelectedTerm(term)}
                  >
                    {term.title}
                  </button>
                </h3>

                <p className="glossary-card__summary">{term.summary}</p>

                {term.decision && (
                  <div className="glossary-card__decision">
                    <small>
                      <strong>Decisión FORJA:</strong> {term.decision}
                    </small>
                  </div>
                )}

                {term.seeAlso.length > 0 && (
                  <div className="glossary-card__see-also">
                    <small>Véase: {term.seeAlso.slice(0, 3).join(", ")}</small>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Drawer para consulta sin salir */}
      <GlossaryDrawer
        term={inspectedTerm}
        onClose={handleCloseDrawer}
        onSelectTerm={setManualSelectedTerm}
      />
    </div>
  );
}
