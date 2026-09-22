import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ExerciseCatalogPage } from "@/features/exercises/pages/ExerciseCatalogPage";
import { ExerciseDetailPage } from "@/features/exercises/pages/ExerciseDetailPage";
import { ExerciseVisualProductionPage } from "@/features/exercises/pages/ExerciseVisualProductionPage";
import { SessionCatalogPage } from "@/features/sessions/pages/SessionCatalogPage";
import { SessionDetailPage } from "@/features/sessions/pages/SessionDetailPage";
import { SessionBuilderPage } from "@/features/session-builder/pages/SessionBuilderPage";
import { SavedSessionsPage } from "@/features/session-builder/pages/SavedSessionsPage";

export const router = createBrowserRouter([
{
  path: "/", element: <AppShell />, children: [
    { index: true, element: <DashboardPage /> },
    { path: "exercises", element: <ExerciseCatalogPage /> },
    { path: "exercises/:exerciseId", element: <ExerciseDetailPage /> },
    { path: "sessions", element: <SessionCatalogPage /> },
    { path: "sessions/saved", element: <SavedSessionsPage /> },
    { path: "sessions/prepare", element: <SessionBuilderPage /> },
    { path: "sessions/prepare/:draftId", element: <SessionBuilderPage /> },
    { path: "sessions/:sessionId", element: <SessionDetailPage /> },
    ...["planning", "athletes", "library"].map((path) => ({ path, element: <ComingSoonPage /> })),
    { path: "*", element: <NotFoundPage /> },
  ],
},
{ path: "/visual-production/:exerciseId", element: <ExerciseVisualProductionPage /> },
]);
