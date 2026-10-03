import ses001 from "../../../../docs/06-sessions/ses-001-initial-strength-and-movement-learning.md?raw";
import ses002 from "../../../../docs/06-sessions/ses-002-general-strength.md?raw";
import ses003 from "../../../../docs/06-sessions/ses-003-short-football-compatible-strength.md?raw";
import type { SessionSource } from "./sessionDocumentParser";

// El contenido sale de docs/06-sessions. Los blockIds son estables a propósito: los
// borradores guardados identifican sus tareas como `${blockId}-${índice}`.
export const SESSION_SOURCES: SessionSource[] = [
  { markdown: ses001, slug: "fuerza-inicial-aprendizaje-patrones", sourcePath: "docs/06-sessions/ses-001-initial-strength-and-movement-learning.md", blockIds: ["lower-patterns", "push-pull", "trunk-control"] },
  { markdown: ses002, slug: "fuerza-general-carga-externa", sourcePath: "docs/06-sessions/ses-002-general-strength.md", blockIds: ["lower-strength", "push-pull", "rotation-control"] },
  { markdown: ses003, slug: "fuerza-breve-semana-futbol", sourcePath: "docs/06-sessions/ses-003-short-football-compatible-strength.md", blockIds: ["unilateral-strength", "pull", "unilateral-carry"] },
];
