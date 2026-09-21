import type { PrescriptionVariable } from "@/features/exercises/domain/exercise";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { getPrescriptionPriority } from "@/features/exercises/domain/prescriptionPriority";

export function PrescriptionMetric({ metric }: { metric: PrescriptionVariable }) { const priority = getPrescriptionPriority(metric); return <div className={`metric metric--${priority}`} data-priority={priority}>{metric.icon && <ForjaIcon name={metric.icon} size={20} />}<span>{metric.label}</span>{metric.value?.type === "range" && <strong>{metric.value.min}–{metric.value.max} {metric.value.unit}</strong>}{metric.value?.text && <small>{metric.value.text}</small>}{metric.description && <small>{metric.description}</small>}</div>; }
