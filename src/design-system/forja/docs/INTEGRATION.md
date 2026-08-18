# Integración en la aplicación FORJA

## 1. Copiar este paquete
Recomendado:
`src/design-system/forja/`

Copia dentro:
- `brand/`
- `src/icons/`
- `src/styles/`

Copia `AGENTS.md` a la raíz del repositorio (fusionándolo con el existente si ya hay uno).

## 2. Instalar Tabler Icons
```bash
npm install @tabler/icons-react
```

o:
```bash
pnpm add @tabler/icons-react
```

## 3. Importar los tokens globales
En el entrypoint de estilos:
```ts
import "./design-system/forja/src/styles/forja-tokens.css";
```

## 4. Usar iconografía semántica
```tsx
import { ForjaIcon } from "@/design-system/forja/src/icons";

<ForjaIcon name="strength" />
<ForjaIcon name="speed" size={20} />
<ForjaIcon name="quality" className="forja-icon--success" />
```

Nunca importes `IconBarbell`, `IconClock`, etc. directamente en pantallas de negocio.
La capa semántica permite cambiar el icono sin modificar toda la aplicación.

## 5. Color
Todos los iconos heredan `currentColor`.
Ejemplo:
```css
.session-card {
  color: var(--forja-primary);
}
```

o:
```tsx
<ForjaIcon name="power" style={{ color: "var(--forja-secondary)" }} />
```

## 6. Logo y wordmark
Los SVG canónicos están en `brand/`.

Para mantener `currentColor`, la mejor opción es importarlos como SVG inline mediante
el mecanismo SVG-as-component que ya use el proyecto (SVGR, Vite SVG React plugin, etc.).

Si se cargan con `<img>`, la geometría seguirá siendo correcta, pero `currentColor`
no heredará el color CSS exterior.

## 7. Sustitución del código existente
Pide a Codex que:
- localice imports de Lucide/Material/FontAwesome/Phosphor;
- determine el concepto semántico;
- sustituya por `<ForjaIcon name="...">`;
- elimine dependencias antiguas únicamente cuando ya no tengan usos;
- no cambie layout o comportamiento durante esta migración.

## 8. Mapeo
Consulta `src/icons/icon-map.json` para los 40 conceptos aprobados.
