import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import type { GlossaryTerm } from "@/features/search/domain/glossary";
import { findGlossaryTerm } from "@/features/search/data/glossaryDocuments";

export interface GlossaryDrawerProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  onSelectTerm?: (term: GlossaryTerm) => void;
}

export function GlossaryDrawer({ term, onClose, onSelectTerm }: GlossaryDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Cierre con Escape y bloqueo de scroll
  useEffect(() => {
    if (!term) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [term, onClose]);

  if (!term) return null;

  const handleSeeAlsoClick = (relTermName: string) => {
    const found = findGlossaryTerm(relTermName);
    if (found && onSelectTerm) {
      onSelectTerm(found);
    }
  };

  return (
    <div
      className="glossary-drawer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glossary-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-drawer-title"
        tabIndex={-1}
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="glossary-drawer__header">
          <div className="glossary-drawer__badges">
            <span className="badge badge--blue">{term.category}</span>
            {term.acronym && <span className="badge badge--amber">{term.acronym}</span>}
          </div>
          <button
            type="button"
            className="glossary-drawer__close-btn"
            onClick={onClose}
            aria-label="Cerrar glosario"
          >
            <ForjaIcon name="close" size={20} />
          </button>
        </header>

        <div className="glossary-drawer__content">
          <h2 id="glossary-drawer-title" className="glossary-drawer__title">
            {term.title}
          </h2>

          <div className="glossary-drawer__definition">
            <p className="glossary-drawer__summary">{term.summary}</p>
          </div>

          {term.decision && (
            <div className="glossary-drawer__decision">
              <div className="glossary-drawer__decision-header">
                <ForjaIcon name="quality" size={18} />
                <strong>Decisión FORJA</strong>
              </div>
              <p>{term.decision}</p>
            </div>
          )}

          {term.seeAlso.length > 0 && (
            <div className="glossary-drawer__see-also">
              <h4>Véase también:</h4>
              <div className="glossary-drawer__see-also-chips">
                {term.seeAlso.map((rel) => {
                  const resolved = findGlossaryTerm(rel);
                  return resolved && onSelectTerm ? (
                    <button
                      key={rel}
                      type="button"
                      className="glossary-chip"
                      onClick={() => handleSeeAlsoClick(rel)}
                    >
                      {rel}
                    </button>
                  ) : (
                    <span key={rel} className="glossary-chip glossary-chip--plain">
                      {rel}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {term.source && (
            <div className="glossary-drawer__source">
              <small>
                <strong>Fuente:</strong> {term.source}
              </small>
            </div>
          )}
        </div>

        <footer className="glossary-drawer__footer">
          <Link
            to={`/glossary#${term.slug}`}
            className="glossary-drawer__full-link"
            onClick={onClose}
          >
            <ForjaIcon name="glossary" size={16} />
            <span>Ver en el glosario completo</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
