import symbolSvg from "@/design-system/forja/brand/forja-symbol.svg?raw";
import wordmarkSvg from "@/design-system/forja/brand/forja-wordmark.svg?raw";
import lockupSvg from "@/design-system/forja/brand/forja-lockup-horizontal.svg?raw";

type Props = { variant?: "symbol" | "wordmark" | "lockup"; size?: "sm" | "md" | "lg"; inverse?: boolean; className?: string };

// Los masters se incrustan en línea para que currentColor herede el color del token (D-008).
// El nombre accesible lo aporta el contenedor; el SVG interior queda oculto a tecnologías de asistencia.
const inline = (svg: string) => svg
  .replace(/<title>[^<]*<\/title>\s*/, "")
  .replace(/\s+role="img"/, "")
  .replace(/\s+aria-label="[^"]*"/, "")
  .replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
const markup = { symbol: inline(symbolSvg), wordmark: inline(wordmarkSvg), lockup: inline(lockupSvg) };

export function ForjaLogo({ variant = "lockup", size = "md", inverse = false, className = "" }: Props) {
  return <span role="img" aria-label="FORJA" className={`forja-logo forja-logo--${variant} forja-logo--${size} ${inverse ? "forja-logo--inverse" : ""} ${className}`} dangerouslySetInnerHTML={{ __html: markup[variant] }} />;
}
