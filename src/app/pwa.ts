// Módulo de gestión del Service Worker, aviso de actualización y estado de conexión (PWA)
// Conforme a la Decisión D-020 (DEC-C)

import { useState, useEffect, useCallback } from "react";

export const PWA_UPDATE_EVENT = "forja:pwa-update-available";

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

export function notifyUpdateAvailable(
  registration: ServiceWorkerRegistration,
  win: Window = window,
): void {
  win.dispatchEvent(
    new CustomEvent(PWA_UPDATE_EVENT, { detail: { registration } }),
  );
}

export function onPwaUpdate(
  listener: (registration: ServiceWorkerRegistration) => void,
  win: Window = window,
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{
      registration: ServiceWorkerRegistration;
    }>;
    if (customEvent.detail?.registration) {
      listener(customEvent.detail.registration);
    }
  };
  win.addEventListener(PWA_UPDATE_EVENT, handler);
  return () => win.removeEventListener(PWA_UPDATE_EVENT, handler);
}

export async function registerServiceWorker(
  options: PwaRegistrationOptions = {},
  nav: Navigator = navigator,
  win: Window = window,
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
      notifyUpdateAvailable(registration, win);
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (nav.serviceWorker.controller) {
            // Ya existía un controlador previo: esto es una actualización disponible
            onUpdateAvailable?.(registration);
            notifyUpdateAvailable(registration, win);
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

export function usePwaUpdate(win: Window = window) {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    return onPwaUpdate((reg) => {
      setRegistration(reg);
      setDismissed(false);
    }, win);
  }, [win]);

  const applyUpdate = useCallback(() => {
    if (registration) {
      applyServiceWorkerUpdate(registration, win);
    }
  }, [registration, win]);

  const dismissUpdate = useCallback(() => {
    setDismissed(true);
  }, []);

  const isUpdateAvailable = Boolean(registration && !dismissed);

  return {
    isUpdateAvailable,
    applyUpdate,
    dismissUpdate,
    registration,
  };
}
