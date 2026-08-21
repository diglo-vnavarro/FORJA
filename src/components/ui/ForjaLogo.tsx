import symbolUrl from "@/design-system/forja/brand/forja-symbol.svg";
import wordmarkUrl from "@/design-system/forja/brand/forja-wordmark.svg";
import lockupUrl from "@/design-system/forja/brand/forja-lockup-horizontal.svg";

type Props = { variant?: "symbol" | "wordmark" | "lockup"; size?: "sm" | "md" | "lg"; inverse?: boolean; className?: string };
const assets = { symbol: symbolUrl, wordmark: wordmarkUrl, lockup: lockupUrl };

export function ForjaLogo({ variant = "lockup", size = "md", inverse = false, className = "" }: Props) {
  return <span className={`forja-logo forja-logo--${variant} forja-logo--${size} ${inverse ? "forja-logo--inverse" : ""} ${className}`}><img src={assets[variant]} alt="FORJA" /></span>;
}
