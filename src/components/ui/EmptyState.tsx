import { ForjaIcon } from "@/design-system/forja/src/icons";
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><ForjaIcon name="observe" size={32} /><h2>{title}</h2><p>{description}</p></div>; }
