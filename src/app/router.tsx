import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { lazyComponent } from "@/app/lazyComponent";
import { RouteFallback } from "@/components/ui/RouteFallback";

const comingSoon = lazyComponent(() => import("@/pages/ComingSoonPage"), "ComingSoonPage");

export const router = createBrowserRouter([
{
  path: "/", element: <AppShell />, HydrateFallback: RouteFallback, children: [
    { index: true, lazy: lazyComponent(() => import("@/pages/DashboardPage"), "DashboardPage") },
    { path: "exercises", lazy: lazyComponent(() => import("@/features/exercises/pages/ExerciseCatalogPage"), "ExerciseCatalogPage") },
    { path: "exercises/:exerciseId", lazy: lazyComponent(() => import("@/features/exercises/pages/ExerciseDetailPage"), "ExerciseDetailPage") },
    { path: "sessions", lazy: lazyComponent(() => import("@/features/sessions/pages/SessionCatalogPage"), "SessionCatalogPage") },
    { path: "sessions/saved", lazy: lazyComponent(() => import("@/features/session-builder/pages/SavedSessionsPage"), "SavedSessionsPage") },
    { path: "sessions/prepare", lazy: lazyComponent(() => import("@/features/session-builder/pages/SessionBuilderPage"), "SessionBuilderPage") },
    { path: "sessions/prepare/:draftId", lazy: lazyComponent(() => import("@/features/session-builder/pages/SessionBuilderPage"), "SessionBuilderPage") },
    { path: "sessions/execute/:draftId", lazy: lazyComponent(() => import("@/features/session-execution/pages/SessionExecutionPage"), "SessionExecutionPage") },
    { path: "sessions/:sessionId", lazy: lazyComponent(() => import("@/features/sessions/pages/SessionDetailPage"), "SessionDetailPage") },
    ...["planning", "athletes", "library"].map((path) => ({ path, lazy: comingSoon })),
    { path: "*", lazy: lazyComponent(() => import("@/pages/NotFoundPage"), "NotFoundPage") },
  ],
},
{ path: "/visual-production/:exerciseId", lazy: lazyComponent(() => import("@/features/exercises/pages/ExerciseVisualProductionPage"), "ExerciseVisualProductionPage") },
]);
