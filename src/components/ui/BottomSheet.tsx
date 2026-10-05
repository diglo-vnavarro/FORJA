import { useEffect, useId, useRef, type ReactNode } from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  subtitle?: string;
  ariaLabel?: string;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  subtitle,
  ariaLabel,
  className = "",
}: BottomSheetProps) {
  const generatedId = useId();
  const titleId = `bottom-sheet-title-${generatedId}`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escucha la tecla Escape para cerrar el diálogo
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Enfoca el botón de cierre al abrirse para accesibilidad de foco
  useEffect(() => {
    if (isOpen) {
      // Breve microtarea para permitir renderizado en DOM
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ui-bottom-sheet-portal">
      <div
        className="ui-bottom-sheet__scrim"
        onClick={onClose}
        aria-hidden="true"
        data-testid="bottom-sheet-scrim"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
        className={`ui-bottom-sheet ${className}`.trim()}
      >
        <div className="ui-bottom-sheet__handle" aria-hidden="true" />

        <header className="ui-bottom-sheet__header">
          <div className="ui-bottom-sheet__titles">
            <h2 id={titleId} className="ui-bottom-sheet__title">
              {title}
            </h2>
            {subtitle && <p className="ui-bottom-sheet__subtitle">{subtitle}</p>}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="ui-bottom-sheet__close"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            <span aria-hidden="true" className="ui-bottom-sheet__close-icon">&times;</span>
          </button>
        </header>

        <div className="ui-bottom-sheet__body">{children}</div>
      </div>
    </div>
  );
}
