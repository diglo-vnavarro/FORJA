import { Link } from "react-router-dom";
import type { Exercise } from "@/features/exercises/domain/exercise";
import { Badge } from "@/components/ui/Badge";
import { ExerciseMediaPlaceholder } from "./ExerciseMediaPlaceholder";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return <article className="exercise-card">
    <div className="exercise-card__media">{exercise.media.thumbnail.src ? <img src={exercise.media.thumbnail.src} alt={exercise.media.thumbnail.alt ?? ""} /> : <ExerciseMediaPlaceholder exercise={exercise} compact />}<span className="exercise-id">{exercise.identity.id}</span></div>
    <div className="exercise-card__body"><p className="card-kicker">{exercise.classification.movementPattern.label}</p><h2><Link to={`/exercises/${exercise.identity.id}`}>{exercise.identity.displayName}</Link></h2><p>{exercise.identity.description}</p><div className="badge-list">{exercise.classification.capabilities.slice(0,2).map((tag) => <Badge key={tag.id} icon={tag.icon} tone="blue">{tag.label}</Badge>)}</div><div className="card-footer"><span>{exercise.context.equipment.slice(0,2).map((item) => item.label).join(" · ")}</span><Link className="text-link" to={`/exercises/${exercise.identity.id}`}>Ver ficha <span aria-hidden="true">→</span></Link></div></div>
  </article>;
}
