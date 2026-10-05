# Walkthrough — F2-02: Service Worker con Caché Offline

## 1. Objetivo
- Qué resuelve:
  - Implementación del Service Worker de FORJA (`public/sw.js`) con soporte offline completo según la decisión D-020 (DEC-C).
  - Precaché de shell durante la instalación (`/`, `/index.html`, `/manifest.webmanifest`, iconos y favicon).
  - Estrategia `Network-first` para documentos HTML con respaldo inmediato a caché para navegación offline instantánea.
  - Estrategia `Cache-first` con captura dinámica en runtime para assets estáticos (JS, CSS, imágenes WebP de ejercicios, fuentes WOFF2 y vectores SVG).
  - Creación del módulo cliente `src/app/pwa.ts` para registrar el Service Worker, detectar actualizaciones pendientes y aplicar recargas limpias con `SKIP_WAITING`.
  - Integración en `src/main.tsx` condicional al entorno de producción.
  - Batería de tests unitarios exhaustivos en `src/app/pwa.test.ts` (9 pruebas).
- Qué queda fuera:
  - El componente de UI para mostrar el aviso de actualización accesible en la interfaz (tarea F2-03).
  - La importación y exportación de datos en formato JSON (tarea F2-04).

## 2. Decisiones tomadas
- **Service Worker nativo sin dependencias externas**: Se implementa en Vanilla JS en `public/sw.js` manteniendo la política de no inflar el `package.json` con librerías pesadas como Workbox cuando el comportamiento estándar del navegador cubre el 100% de las necesidades.
- **Respeto a borradores y sesiones**: El Service Worker nunca fuerza la actualización (`skipWaiting`) por sí solo; espera el mensaje explícito del cliente cuando el usuario lo solicite.

## 3. Archivos modificados y creados
- `public/sw.js`: Archivo principal del Service Worker con estrategias de caché `Network-first` y `Cache-first`.
- `src/app/pwa.ts`: Módulo de registro, ciclo de vida de actualizaciones y utilidades del Service Worker.
- `src/app/pwa.test.ts`: Pruebas unitarias de detección de soporte, registro, actualización y evento `SKIP_WAITING`.
- `src/main.tsx`: Registro del Service Worker en producción al dispararse el evento `load`.
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F2-02 como completada.

## 4. Verificación
- `npm run typecheck`: OK (0 errores).
- `npm run lint`: OK (0 errores).
- `npm test`: OK (21 suites, 82 pruebas superadas).
- `npm run build`: OK (build de producción limpio).
- `npm run check:links`: OK (113 archivos Markdown, 1016 enlaces, 0 problemas).

## 5. Pendiente
- Implementar la tarea F2-03 (componente de aviso visual de actualización de versión).
