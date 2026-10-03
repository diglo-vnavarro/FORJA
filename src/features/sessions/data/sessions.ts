import type { Session } from "@/features/sessions/domain/session";
import { SESSION_SOURCES } from "./sessionDocuments";
import { parseSessionDocument } from "./sessionDocumentParser";

const parsed = SESSION_SOURCES.map(parseSessionDocument);

// Los tests exigen que esta lista esté vacía: un cambio editorial que rompa la estructura
// de una sesión falla en CI en lugar de llegar vacío a la interfaz.
export const sessionDocumentProblems = parsed.flatMap((result) => result.problems);
if (import.meta.env.DEV && sessionDocumentProblems.length) console.warn("Sesiones con problemas de estructura:", sessionDocumentProblems);

export const sessions: Session[] = parsed.map((result) => result.session);

export const getSessionById = (value: string) => sessions.find((session) => session.identity.id.toLowerCase() === value.toLowerCase() || session.identity.slug === value);
