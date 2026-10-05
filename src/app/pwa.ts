// Módulo de gestión del Service Worker y estado de conexión (PWA)
// Conforme a la Decisión D-020 (DEC-C)

export type PwaRegistrationOptions = {
  swUrl?: string;
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
  onError?: (error: unknown) => void;
};

export type PwaState = {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
};

export function isServiceWorkerSupported(nav: Navigator = navigator): boolean {
  return typeof nav !== "undefined" && "serviceWorker" in nav;
}

export async function registerServiceWorker(
  options: PwaRegistrationOptions = {},
  nav: Navigator = navigator,
): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported(nav)) {
    return null;
  }

  const {
    swUrl = "/sw.js",
    onUpdateAvailable,
    onOfflineReady,
    onError,
  } = options;

  try {
    const registration = await nav.serviceWorker.register(swUrl);

    // Si ya hay un worker en espera (esperando activación), notificar inmediatamente
    if (registration.waiting) {
      onUpdateAvailable?.(registration);
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (nav.serviceWorker.controller) {
            // Ya existía un controlador previo: esto es una actualización disponible
            onUpdateAvailable?.(registration);
          } else {
            // Primer registro completado: la app está lista para usarse sin conexión
            onOfflineReady?.();
          }
        }
      });
    });

    return registration;
  } catch (error) {
    onError?.(error);
    return null;
  }
}

export function applyServiceWorkerUpdate(
  registration: ServiceWorkerRegistration,
  win: Window = window,
): void {
  if (registration.waiting) {
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Cuando el nuevo Service Worker toma el control, recargar la página limpiamente
    if (win.navigator?.serviceWorker) {
      const handleControllerChange = () => {
        win.navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleControllerChange,
        );
        win.location.reload();
      };
      win.navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
      );
    }
  }
}
