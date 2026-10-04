import { ForjaIcon } from "@/design-system/forja/src/icons";
import { usePwaUpdate } from "@/app/pwa";

export type UpdatePromptProps = {
  isUpdateAvailable?: boolean;
  onApplyUpdate?: () => void;
  onDismissUpdate?: () => void;
};

export function UpdatePrompt({
  isUpdateAvailable: controlledIsAvailable,
  onApplyUpdate: controlledApply,
  onDismissUpdate: controlledDismiss,
}: UpdatePromptProps = {}) {
  const pwaUpdate = usePwaUpdate();

  const isAvailable = controlledIsAvailable !== undefined ? controlledIsAvailable : pwaUpdate.isUpdateAvailable;
  const handleApply = controlledApply || pwaUpdate.applyUpdate;
  const handleDismiss = controlledDismiss || pwaUpdate.dismissUpdate;

  if (!isAvailable) {
    return null;
  }

  return (
    <aside
      className="update-prompt"
      role="status"
      aria-live="polite"
      aria-label="Aviso de actualización de la aplicación"
    >
      <div className="update-prompt__content">
        <ForjaIcon name="endurance" size={20} className="update-prompt__icon" />
        <span className="update-prompt__message">
          Hay una nueva versión de FORJA disponible.
        </span>
      </div>
      <div className="update-prompt__actions">
        <button
          type="button"
          className="update-prompt__btn update-prompt__btn--primary"
          onClick={handleApply}
        >
          Actualizar ahora
        </button>
        <button
          type="button"
          className="update-prompt__btn update-prompt__btn--ghost"
          onClick={handleDismiss}
        >
          Más tarde
        </button>
      </div>
    </aside>
  );
}
