import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isServiceWorkerSupported,
  registerServiceWorker,
  applyServiceWorkerUpdate,
} from "./pwa";

describe("pwa module", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("isServiceWorkerSupported", () => {
    it("returns true when navigator has serviceWorker", () => {
      const mockNav = { serviceWorker: {} } as unknown as Navigator;
      expect(isServiceWorkerSupported(mockNav)).toBe(true);
    });

    it("returns false when navigator does not have serviceWorker", () => {
      const mockNav = {} as Navigator;
      expect(isServiceWorkerSupported(mockNav)).toBe(false);
    });
  });

  describe("registerServiceWorker", () => {
    it("returns null if serviceWorker is unsupported", async () => {
      const mockNav = {} as Navigator;
      const result = await registerServiceWorker({}, mockNav);
      expect(result).toBeNull();
    });

    it("registers sw.js with default url and returns registration", async () => {
      const mockRegistration = {
        addEventListener: vi.fn(),
      } as unknown as ServiceWorkerRegistration;

      const registerMock = vi.fn().mockResolvedValue(mockRegistration);
      const mockNav = {
        serviceWorker: {
          register: registerMock,
        },
      } as unknown as Navigator;

      const result = await registerServiceWorker({}, mockNav);
      expect(registerMock).toHaveBeenCalledWith("/sw.js");
      expect(result).toBe(mockRegistration);
    });

    it("notifies immediately if there is a waiting worker", async () => {
      const mockWaiting = {
        postMessage: vi.fn(),
      } as unknown as ServiceWorker;

      const mockRegistration = {
        waiting: mockWaiting,
        addEventListener: vi.fn(),
      } as unknown as ServiceWorkerRegistration;

      const registerMock = vi.fn().mockResolvedValue(mockRegistration);
      const mockNav = {
        serviceWorker: {
          register: registerMock,
        },
      } as unknown as Navigator;

      const onUpdateAvailable = vi.fn();
      await registerServiceWorker({ onUpdateAvailable }, mockNav);

      expect(onUpdateAvailable).toHaveBeenCalledWith(mockRegistration);
    });

    it("notifies when updatefound installs a new worker with active controller", async () => {
      let updatefoundHandler: (() => void) | undefined;
      let statechangeHandler: (() => void) | undefined;

      const mockInstalling = {
        state: "installing",
        addEventListener: vi.fn((event, handler) => {
          if (event === "statechange") statechangeHandler = handler;
        }),
      } as unknown as ServiceWorker;

      const mockRegistration = {
        installing: mockInstalling,
        addEventListener: vi.fn((event, handler) => {
          if (event === "updatefound") updatefoundHandler = handler;
        }),
      } as unknown as ServiceWorkerRegistration;

      const registerMock = vi.fn().mockResolvedValue(mockRegistration);
      const mockNav = {
        serviceWorker: {
          register: registerMock,
          controller: {} as ServiceWorker,
        },
      } as unknown as Navigator;

      const onUpdateAvailable = vi.fn();
      await registerServiceWorker({ onUpdateAvailable }, mockNav);

      // Trigger updatefound
      updatefoundHandler?.();
      // Transition state to installed
      Object.defineProperty(mockInstalling, "state", { value: "installed" });
      statechangeHandler?.();

      expect(onUpdateAvailable).toHaveBeenCalledWith(mockRegistration);
    });

    it("notifies onOfflineReady when worker installs without previous controller", async () => {
      let updatefoundHandler: (() => void) | undefined;
      let statechangeHandler: (() => void) | undefined;

      const mockInstalling = {
        state: "installing",
        addEventListener: vi.fn((event, handler) => {
          if (event === "statechange") statechangeHandler = handler;
        }),
      } as unknown as ServiceWorker;

      const mockRegistration = {
        installing: mockInstalling,
        addEventListener: vi.fn((event, handler) => {
          if (event === "updatefound") updatefoundHandler = handler;
        }),
      } as unknown as ServiceWorkerRegistration;

      const registerMock = vi.fn().mockResolvedValue(mockRegistration);
      const mockNav = {
        serviceWorker: {
          register: registerMock,
          controller: null,
        },
      } as unknown as Navigator;

      const onOfflineReady = vi.fn();
      await registerServiceWorker({ onOfflineReady }, mockNav);

      updatefoundHandler?.();
      Object.defineProperty(mockInstalling, "state", { value: "installed" });
      statechangeHandler?.();

      expect(onOfflineReady).toHaveBeenCalled();
    });

    it("handles registration errors and invokes onError", async () => {
      const error = new Error("Registration failed");
      const registerMock = vi.fn().mockRejectedValue(error);
      const mockNav = {
        serviceWorker: {
          register: registerMock,
        },
      } as unknown as Navigator;

      const onError = vi.fn();
      const result = await registerServiceWorker({ onError }, mockNav);

      expect(result).toBeNull();
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe("applyServiceWorkerUpdate", () => {
    it("posts SKIP_WAITING to waiting worker and reloads on controllerchange", () => {
      const postMessageMock = vi.fn();
      const reloadMock = vi.fn();
      let controllerChangeHandler: (() => void) | undefined;

      const mockWaiting = {
        postMessage: postMessageMock,
      } as unknown as ServiceWorker;

      const mockRegistration = {
        waiting: mockWaiting,
      } as unknown as ServiceWorkerRegistration;

      const mockWindow = {
        navigator: {
          serviceWorker: {
            addEventListener: vi.fn((event, handler) => {
              if (event === "controllerchange") {
                controllerChangeHandler = handler;
              }
            }),
            removeEventListener: vi.fn(),
          },
        },
        location: {
          reload: reloadMock,
        },
      } as unknown as Window;

      applyServiceWorkerUpdate(mockRegistration, mockWindow);

      expect(postMessageMock).toHaveBeenCalledWith({ type: "SKIP_WAITING" });

      // Trigger controllerchange
      controllerChangeHandler?.();
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});
