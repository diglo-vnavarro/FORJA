import type { ReactNode } from "react";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { ForjaLogo } from "@/components/ui/ForjaLogo";
import type { Exercise, PrescriptionVariable, TaxonomyTerm } from "@/features/exercises/domain/exercise";
import { buildExerciseDerivativeContent } from "./derivativeContent";
import "./exercise-derivatives.css";

function IconLabel({ term }: { term: TaxonomyTerm<string> }) {
  return <span className="derivative-icon-label">{term.icon && <ForjaIcon name={term.icon} size={18} />}<span>{term.label}</span></span>;
}

function Section({ title, icon, children }: { title: string; icon?: Parameters<typeof ForjaIcon>[0]["name"]; children: ReactNode }) {
  return <section className="derivative-section"><h2>{icon && <ForjaIcon name={icon} size={20} />}{title}</h2>{children}</section>;
}

function List({ items, limit }: { items: string[]; limit?: number }) {
  const visible = items.filter(Boolean).slice(0, limit);
  return visible.length ? <ul>{visible.map((item) => <li key={item}>{item}</li>)}</ul> : null;
}

function Metrics({ metrics }: { metrics: PrescriptionVariable[] }) {
  return metrics.length ? <div className="derivative-metrics">{metrics.map((metric) => <div key={`${metric.kind.type}-${metric.label}`}>{metric.icon && <ForjaIcon name={metric.icon} size={19} />}<span>{metric.label}</span>{metric.value?.text && <strong>{metric.value.text}</strong>}</div>)}</div> : null;
}

function InfographicHeader({ exercise }: { exercise: Exercise }) {
  const content = buildExerciseDerivativeContent(exercise);
  return <header className="infographic-v2-header"><strong>{content.identity.id}</strong><div><h1>{content.identity.displayName}</h1><p>{content.identity.objective}</p></div><ForjaLogo variant="lockup" size="lg" /></header>;
}

function ClassificationStrip({ exercise }: { exercise: Exercise }) {
  const content = buildExerciseDerivativeContent(exercise);
  const attribute = content.attributes.flatMap((item) => item.content).find((item) => /bilateral|unilateral/i.test(item))
    ?? `${exercise.identity.description} ${exercise.identity.objective} ${exercise.classification.category}`.match(/\b(?:bilateral|unilateral)\b/i)?.[0];
  return <section className="infographic-v2-classification">
    {content.primaryCapability && <IconLabel term={content.primaryCapability} />}
    <IconLabel term={content.pattern} />
    {attribute && <span className="derivative-icon-label"><ForjaIcon name="bodyweight" size={25} /><span>{attribute}</span></span>}
    <span className="derivative-icon-label"><ForjaIcon name="externalLoad" size={25} /><span>Carga externa</span></span>
    {content.equipment.length > 0 && <span className="derivative-icon-label">{content.equipment[0].icon && <ForjaIcon name={content.equipment[0].icon} size={25} />}<span>{content.equipment.map((item) => item.label).join(" / ")}</span></span>}
  </section>;
}

function ExecutionPanel({ exercise }: { exercise: Exercise }) {
  const content = buildExerciseDerivativeContent(exercise);
  return <section className="infographic-v2-execution"><div className="infographic-v2-master"><img src={exercise.media.masterImage.src} alt={exercise.media.masterImage.alt ?? ""} /><div style={{ gridTemplateColumns: `repeat(${content.phaseLabels.length}, 1fr)` }}>{content.phaseLabels.map((label, index) => <span key={label}><b>{index + 1}</b>{label}</span>)}</div></div><div className="infographic-v2-how"><h2>Cómo realizarla</h2>{content.executionSteps.map((step, index) => <div className="infographic-v2-step" key={`${step.label}-${step.text}`}><b>{index + 1}</b><p><strong>{step.label}</strong>{step.text}</p></div>)}</div></section>;
}

function CoachingTriad({ exercise }: { exercise: Exercise }) {
  const { coachingTriad } = buildExerciseDerivativeContent(exercise);
  const blocks = [
    { className: "competency", title: "Competencia", icon: "competence" as const, items: coachingTriad.competency },
    { className: "modify", title: "Modifica la tarea si…", icon: "modifyTask" as const, items: coachingTriad.modify },
    { className: "acceptable", title: "No corrijas automáticamente", icon: "observe" as const, items: coachingTriad.acceptable },
  ];
  return <section className="infographic-v2-triad">{blocks.filter((block) => block.items.length > 0).map((block) => <article className={block.className} key={block.title}><h2><ForjaIcon name={block.icon} size={22} />{block.title}</h2><List items={block.items} /></article>)}</section>;
}

function TaskAdaptation({ exercise }: { exercise: Exercise }) {
  const { adaptations, identity } = buildExerciseDerivativeContent(exercise);
  if (!adaptations.accessible.length && !adaptations.demand.length) return null;
  const relation = (item: (typeof adaptations.accessible)[number]) => <span key={`${item.targetId}-${item.label}`}>{item.targetId && !item.label.includes(item.targetId) && <b>{item.targetId}</b>}{item.label}</span>;
  return <section className="infographic-v2-adaptation"><h2>Adaptar la tarea</h2><div><article><h3>Hazla más accesible</h3>{adaptations.accessible.map(relation)}</article><div className="infographic-v2-current"><ForjaLogo variant="symbol" size="md" /><strong>{identity.id}</strong><span>{identity.displayName}</span></div><article><h3>Cambia / aumenta demanda</h3>{adaptations.demand.map(relation)}</article></div><p>No existe una única progresión obligatoria.</p></section>;
}

function PrescriptionVariables({ exercise }: { exercise: Exercise }) {
  const { prescription } = buildExerciseDerivativeContent(exercise);
  if (!prescription.length) return null;
  return <section className="infographic-v2-prescription"><h2>Variables de prescripción</h2><div>{prescription.map((metric) => <span key={`${metric.kind.type}-${metric.label}`}>{metric.icon && <ForjaIcon name={metric.icon} size={24} />}<b>{metric.label}</b></span>)}</div></section>;
}

function ContextExample({ exercise }: { exercise: Exercise }) {
  const { contextMetrics } = buildExerciseDerivativeContent(exercise);
  if (!contextMetrics.length) return null;
  return <section className="infographic-v2-context"><h2>Ejemplo contextual</h2><div>{contextMetrics.map((metric) => <span key={metric.label}>{metric.value ? <strong>{metric.value}</strong> : metric.icon && <ForjaIcon name={metric.icon} size={25} />}<small>{metric.label}</small></span>)}</div></section>;
}

function ForjaFooter({ exercise }: { exercise: Exercise }) {
  const { footerMessage } = buildExerciseDerivativeContent(exercise);
  return <footer className="infographic-v2-footer"><p>{footerMessage}</p><ForjaLogo variant="lockup" size="md" /></footer>;
}

export function ExerciseThumbnailRenderer({ exercise }: { exercise: Exercise }) {
  return <div className="exercise-derivative exercise-thumbnail" data-export-root data-export-kind="thumbnail"><img src={exercise.media.masterImage.src} alt={exercise.media.masterImage.alt ?? ""} /></div>;
}

export function ExerciseInfographicRenderer({ exercise }: { exercise: Exercise }) {
  const content = buildExerciseDerivativeContent(exercise);
  return <article className="exercise-derivative exercise-infographic" data-export-root data-export-kind="infographic">
    <header className="derivative-header"><div><span>{content.identity.id}</span><h1>{content.identity.displayName}</h1><p>{content.identity.objective}</p></div><ForjaLogo variant="lockup" size="lg" /></header>
    <div className="derivative-classification">
      {content.primaryCapability && <IconLabel term={content.primaryCapability} />}
      <IconLabel term={content.pattern} />
      {content.attributes.flatMap((item) => item.content.slice(0, 1)).map((value) => <span key={value}>{value}</span>)}
      {content.equipment.map((term) => <IconLabel key={term.id} term={term} />)}
    </div>
    <div className="derivative-hero"><img src={exercise.media.masterImage.src} alt={exercise.media.masterImage.alt ?? ""} /><Section title="Ejecución" icon="technique"><List items={content.execution} /></Section></div>
    <div className="derivative-coaching">
      <Section title="Claves" icon="observe"><List items={content.cues} /></Section>
      <Section title="Competencia" icon="competence"><List items={content.competency} /></Section>
      <Section title="Modificar" icon="modifyTask"><List items={content.errors} /></Section>
      <Section title="Variabilidad aceptable" icon="makeMoreAccessible"><List items={content.variations} /></Section>
    </div>
    {content.prescription.length > 0 && <Section title="Prescripción" icon="sets"><Metrics metrics={content.prescription} /></Section>}
    {content.contextualExample.length > 0 && <Section title="Ejemplo contextual" icon="intention"><List items={content.contextualExample} /></Section>}
    <footer>Contenido derivado de la ficha Exercise · Master visual aprobado</footer>
  </article>;
}

export function ExerciseInfographicV21Renderer({ exercise }: { exercise: Exercise }) {
  return <article className="exercise-derivative exercise-infographic-v2" data-export-root data-export-kind="infographic-v2-1">
    <InfographicHeader exercise={exercise} />
    <ClassificationStrip exercise={exercise} />
    <ExecutionPanel exercise={exercise} />
    <CoachingTriad exercise={exercise} />
    <TaskAdaptation exercise={exercise} />
    <div className="infographic-v2-bottom"><PrescriptionVariables exercise={exercise} /><ContextExample exercise={exercise} /></div>
    <ForjaFooter exercise={exercise} />
  </article>;
}

export function ExerciseInfographicV21ComparisonRenderer({ exercise, previousPath, validationExercise }: { exercise: Exercise; previousPath: string; validationExercise: Exercise }) {
  return <article className="exercise-derivative infographic-comparison" data-export-root data-export-kind="infographic-v2-1-comparison"><header><span>QA · INFOGRAPHIC TEMPLATE V2.1</span><h1>Validación visual y de reusabilidad</h1></header><div><figure><figcaption>{exercise.identity.id} · V2 APPROVED BASE</figcaption><img src={`/${previousPath}`} alt={`${exercise.identity.id} infographic V2`} /></figure><figure><figcaption>{exercise.identity.id} · V2.1 PENDING REVIEW</figcaption><ExerciseInfographicV21Renderer exercise={exercise} /></figure><figure><figcaption>{validationExercise.identity.id} · V2.1 PENDING REVIEW</figcaption><ExerciseInfographicV21Renderer exercise={validationExercise} /></figure></div></article>;
}

export function ExerciseSessionCardRenderer({ exercise }: { exercise: Exercise }) {
  const content = buildExerciseDerivativeContent(exercise);
  return <article className="exercise-derivative exercise-session-card" data-export-root data-export-kind="session-card">
    <header><div><span>{content.identity.id}</span><h1>{content.identity.displayName}</h1></div><ForjaLogo variant="symbol" size="md" /></header>
    <img className="session-master" src={exercise.media.masterImage.src} alt={exercise.media.masterImage.alt ?? ""} />
    <Metrics metrics={content.sessionPrescription} />
    {content.contextualExample.length > 0 && <div className="session-context"><strong>Ejemplo contextual</strong><List items={content.contextualExample} limit={5} /></div>}
    <div className="session-guidance"><Section title="Consignas" icon="observe"><List items={content.cues} limit={5} /></Section>{content.stopCriterion && <Section title="Parar o modificar" icon="modifyTask"><p>{content.stopCriterion}</p></Section>}</div>
  </article>;
}

export function ExerciseDerivativeQaRenderer({ exercise }: { exercise: Exercise }) {
  return <article className="exercise-derivative derivative-qa" data-export-root data-export-kind="qa"><header><div><span>QA DERIVADOS · {exercise.identity.id}</span><h1>{exercise.identity.displayName}</h1></div><ForjaLogo variant="lockup" size="lg" /></header><div className="qa-grid"><figure><figcaption>MASTER · APPROVED</figcaption><img src={exercise.media.masterImage.src} alt="" /></figure><figure><figcaption>THUMBNAIL · CANDIDATE</figcaption><div className="qa-thumbnail"><ExerciseThumbnailRenderer exercise={exercise} /></div></figure><figure className="qa-infographic"><figcaption>INFOGRAPHIC · CANDIDATE</figcaption><div><ExerciseInfographicRenderer exercise={exercise} /></div></figure><figure className="qa-session"><figcaption>SESSION CARD · CANDIDATE</figcaption><div><ExerciseSessionCardRenderer exercise={exercise} /></div></figure></div></article>;
}
