import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
export function Badge({ icon, children, tone = "neutral" }: { icon?: ForjaIconName; children: React.ReactNode; tone?: "neutral" | "blue" | "green" }) { return <span className={`badge badge--${tone}`}>{icon && <ForjaIcon name={icon} size={16} />}<span>{children}</span></span>; }
