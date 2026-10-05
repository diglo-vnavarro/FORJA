import { useId, useState, type ReactNode } from "react";

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  headerClassName?: string;
  panelClassName?: string;
  id?: string;
}

export function Collapsible({
  title,
  children,
  subtitle,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className = "",
  headerClassName = "",
  panelClassName = "",
  id: explicitId,
}: CollapsibleProps) {
  const generatedId = useId();
  const rootId = explicitId || `collapsible-${generatedId}`;
  const triggerId = `${rootId}-trigger`;
  const panelId = `${rootId}-panel`;

  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const nextState = !isExpanded;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div className={`ui-collapsible ${isExpanded ? "ui-collapsible--open" : ""} ${className}`.trim()}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={handleToggle}
        className={`ui-collapsible__trigger ${headerClassName}`.trim()}
      >
        <div className="ui-collapsible__heading">
          <span className="ui-collapsible__title">{title}</span>
          {subtitle && <span className="ui-collapsible__subtitle">{subtitle}</span>}
        </div>
        <span
          className={`ui-collapsible__chevron ${isExpanded ? "ui-collapsible__chevron--expanded" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={`ui-collapsible__panel ${panelClassName}`.trim()}
        >
          {children}
        </div>
      )}
    </div>
  );
}
