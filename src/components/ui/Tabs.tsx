import {
  useId,
  useState,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  ariaLabel = "Pestañas de navegación",
  className = "",
}: TabsProps) {
  const generatedId = useId();
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || "",
  );

  const activeTabId = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleSelectTab = (id: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const enabledIndex = enabledTabs.findIndex((t) => t.id === tabs[currentIndex]?.id);

    let nextTab: TabItem | undefined;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextTab = enabledTabs[(enabledIndex + 1) % enabledTabs.length];
        break;
      case "ArrowLeft":
        e.preventDefault();
        nextTab = enabledTabs[(enabledIndex - 1 + enabledTabs.length) % enabledTabs.length];
        break;
      case "Home":
        e.preventDefault();
        nextTab = enabledTabs[0];
        break;
      case "End":
        e.preventDefault();
        nextTab = enabledTabs[enabledTabs.length - 1];
        break;
      default:
        return;
    }

    if (nextTab) {
      handleSelectTab(nextTab.id);
      tabRefs.current.get(nextTab.id)?.focus();
    }
  };

  const activeContent = tabs.find((t) => t.id === activeTabId)?.content;

  return (
    <div className={`ui-tabs ${className}`.trim()}>
      <div role="tablist" aria-label={ariaLabel} className="ui-tabs__list">
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === activeTabId;
          const tabButtonId = `tab-${generatedId}-${tab.id}`;
          const panelId = `panel-${generatedId}-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node);
                else tabRefs.current.delete(tab.id);
              }}
              id={tabButtonId}
              role="tab"
              type="button"
              disabled={tab.disabled}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              className={`ui-tabs__tab ${isSelected ? "ui-tabs__tab--active" : ""}`.trim()}
              onClick={() => handleSelectTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.icon && <span className="ui-tabs__icon" aria-hidden="true">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isSelected = tab.id === activeTabId;
        const tabButtonId = `tab-${generatedId}-${tab.id}`;
        const panelId = `panel-${generatedId}-${tab.id}`;

        if (!isSelected) return null;

        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={tabButtonId}
            className="ui-tabs__panel"
          >
            {activeContent}
          </div>
        );
      })}
    </div>
  );
}
