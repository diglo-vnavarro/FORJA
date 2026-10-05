# Walkthrough — F2-01: Registro de DEC-C (Estrategia Offline y Actualización)

## 1. Objetivo
- Qué resuelve:
  - Registro formal de la decisión arquitectónica D-020 (DEC-C) en `docs/00-project/decisions.md`.
  - Establece la estrategia de Service Worker para la Fase 2 (PWA):
    * `Cache-first` para assets estáticos con hash (JS, CSS, fuentes web y vectores de marca).
    * `Network-first` con fallback a caché para `index.html` para detectar despliegues sin bloquear la navegación offline.
    * `Cache-first` con precaché para la biblioteca de imágenes maestras y miniaturas WebP de ejercicios.
    * Ciclo de vida no destructivo del Service Worker: la persona usuaria decide cuándo aplicar una actualización disponible, protegiendo borradores activos y sesiones en ejecución.
    * Persistencia continuada en `localStorage` con funciones nativas de importación/exportación JSON.
- Qué queda fuera:
  - La implementación técnica de los archivos del Service Worker y el aviso visual (corresponde a F2-02 y F2-03).

## 2. Decisiones tomadas
- **D-020 (DEC-C)**: Desacopla la descarga de nuevas versiones del Service Worker de la activación destructiva (`skipWaiting`), obligando a avisar a la persona usuaria para que confirme el momento de recarga cuando no tenga datos sin guardar.

## 3. Archivos modificados y creados
- `docs/00-project/decisions.md`: Registro de la decisión D-020 (DEC-C).
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F2-01 como completada.
- `docs/00-project/walkthrough-f2-01-register-dec-c.md`: Walkthrough de verificación.

## 4. Verificación
- `npm run typecheck`: OK (0 errores).
- `npm run lint`: OK (0 errores).
- `npm test`: OK (20 suites, 73 pruebas pasadas).
- `npm run build`: OK (build de producción limpio).
- `npm run check:links`: OK (113 archivos Markdown, 1016 enlaces, 0 problemas).

## 5. Pendiente
- Proceder a F2-02 (implementación del Service Worker) y F2-03 (componente de aviso de nueva versión).
