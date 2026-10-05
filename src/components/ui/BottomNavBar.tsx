import type { ReactNode } from "react";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
}

export interface BottomNavBarProps {
  items: BottomNavItem[];
  ariaLabel?: string;
  className?: string;
}

export function BottomNavBar({
  items,
  ariaLabel = "Navegación principal inferior",
  className = "",
}: BottomNavBarProps) {
  return (
    <nav role="navigation" aria-label={ariaLabel} className={`ui-bottom-nav ${className}`.trim()}>
      <ul className="ui-bottom-nav__list">
        {items.map((item) => {
          const content = (
            <>
              <span className="ui-bottom-nav__icon-wrapper" aria-hidden="true">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="ui-bottom-nav__badge">{item.badge}</span>
                )}
              </span>
              <span className="ui-bottom-nav__label">{item.label}</span>
            </>
          );

          return (
            <li key={item.id} className="ui-bottom-nav__item">
              {item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  aria-current={item.active ? "page" : undefined}
                  className={`ui-bottom-nav__link ${item.active ? "ui-bottom-nav__link--active" : ""}`.trim()}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  aria-current={item.active ? "page" : undefined}
                  className={`ui-bottom-nav__link ${item.active ? "ui-bottom-nav__link--active" : ""}`.trim()}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
