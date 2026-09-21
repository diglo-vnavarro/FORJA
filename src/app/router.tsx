import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ExerciseCatalogPage } from "@/features/exercises/pages/ExerciseCatalogPage";
import { ExerciseDetailPage } from "@/features/exercises/pages/ExerciseDetailPage";
import { ExerciseVisualProductionPage } from "@/features/exercises/pages/ExerciseVisualProductionPage";

export const router = createBrowserRouter([
{
  path: "/", element: <AppShell />, children: [
    { index: true, element: <DashboardPage /> },
    { path: "exercises", element: <ExerciseCatalogPage /> },
    { path: "exercises/:exerciseId", element: <ExerciseDetailPage /> },
    ...["sessions", "planning", "athletes", "library"].map((path) => ({ path, element: <ComingSoonPage /> })),
    { path: "*", element: <NotFoundPage /> },
  ],
},
{ path: "/visual-production/:exerciseId", element: <ExerciseVisualProductionPage /> },
]);
