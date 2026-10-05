import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import { ExerciseMediaPlaceholder } from "@/features/exercises/components/ExerciseMediaPlaceholder";
import { ExerciseOverview } from "@/features/exercises/components/ExerciseOverview";
import { PrescriptionMetric } from "@/features/exercises/components/PrescriptionMetric";
import type { ExerciseRelation } from "@/features/exercises/domain/exercise";
import { getExerciseById } from "@/features/exercises/data/exercises";
import { GlossaryDrawer } from "@/features/search/components/GlossaryDrawer";
import { GlossaryTermChip } from "@/features/search/components/GlossaryTermChip";
import { findGlossaryTerm } from "@/features/search/data/glossaryDocuments";
import type { GlossaryTerm } from "@/features/search/domain/glossary";

function ContentPanel({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: ForjaIconName;
  items: string[];
  tone?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={`coaching-panel ${tone ? `coaching-panel--${tone}` : ""}`}>
      <h3>
        <ForjaIcon name={icon} size={22} />
        {title}
      </h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function RelationGroup({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ForjaIconName;
  items: ExerciseRelation[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3>
        <ForjaIcon name={icon} size={21} />
        {title}
      </h3>
      {items.map((item, index) => (
        <div className="relation" key={`${index}-${item.label}`}>
          {item.targetId ? (
            <Link to={`/exercises/${item.targetId}`}>
              <strong>{item.label}</strong>
            </Link>
          ) : (
            <strong>{item.label}</strong>
          )}
          {item.description && <p>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

function DetailHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

type TabKey = "prescription" | "technique" | "relations";

interface DetailTabItem {
  key: TabKey;
  label: string;
  icon: ForjaIconName;
}

const DETAIL_TABS: DetailTabItem[] = [
  { key: "prescription", label: "Prescripción y uso", icon: "strength" },
  { key: "technique", label: "Técnica y claves", icon: "technique" },
  { key: "relations", label: "Modificaciones y criterio", icon: "modifyTask" },
];

export function ExerciseDetailPage() {
  const { exerciseId = "" } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>("prescription");
  const [inspectedTerm, setInspectedTerm] = useState<GlossaryTerm | null>(null);

  const exercise = getExerciseById(exerciseId);

  const relevantGlossaryTerms = useMemo(() => {
    if (!exercise) return [];
    const candidateKeywords = [
      exercise.classification.movementPattern.label,
      ...exercise.classification.capabilities.map((c) => c.label),
      ...exercise.prescription.variables.map((v) => v.label),
      "1RM",
      "RIR",
      "RPE",
      "Series",
      "Repeticiones",
      "Intensidad",
      "Volumen",
      "Progresión",
      "Regresión",
      "Criterios de parada",
    ];

    const matched = new Map<string, GlossaryTerm>();
    for (const kw of candidateKeywords) {
      const found = findGlossaryTerm(kw);
      if (found && !matched.has(found.id)) {
        matched.set(found.id, found);
      }
    }
    return Array.from(matched.values());
  }, [exercise]);

  if (!exercise) {
    return (
      <div className="page">
        <EmptyState
          title="Ejercicio no encontrado"
          description="El identificador solicitado no existe entre las fichas utilizables."
        />
        <Link className="button" to="/exercises">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const {
    identity,
    classification,
    context,
    media,
    prescription,
    coaching,
    decision,
    relations,
    safety,
    whatToRecord,
    traceability,
  } = exercise;

  const contextItems = [
    ...context.requirements,
    ...context.environment,
    ...context.space,
    ...context.surface,
  ];

  const stopCriteriaItems = [...safety.warnings, ...coaching.stopCriteria];

  const methodological = [
    ...decision.chooseWhen.map((item) => `Elegir cuando: ${item}`),
    ...decision.avoidWhen.map((item) => `Evitar cuando: ${item}`),
    ...traceability.methodologicalNotes,
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % DETAIL_TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + DETAIL_TABS.length) % DETAIL_TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = DETAIL_TABS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextTab = DETAIL_TABS[nextIndex];
    setActiveTab(nextTab.key);
    const nextButton = document.getElementById(`tab-${nextTab.key}`);
    nextButton?.focus();
  };

  return (
    <article className="page exercise-detail">
      <nav className="breadcrumbs" aria-label="Migas de pan">
        <Link to="/exercises">Ejercicios</Link>
        <span aria-hidden="true">/</span>
        <span>{identity.id}</span>
      </nav>

      <header className="exercise-hero">
        <div className="exercise-hero__copy">
          <p className="eyebrow">
            {identity.id} · {classification.category}
          </p>
          <h1>{identity.displayName}</h1>
          {identity.aliases.length > 0 && (
            <p className="exercise-aliases">También: {identity.aliases.join(" · ")}</p>
          )}
          <p className="hero-objective">{identity.description}</p>
          <div className="badge-list">
            {classification.capabilities.map((tag) => (
              <Badge key={tag.id} icon={tag.icon} tone="blue">
                {tag.label}
              </Badge>
            ))}
            {context.equipment.map((tag) => (
              <Badge key={tag.id} icon={tag.icon}>
                {tag.label}
              </Badge>
            ))}
          </div>
          <dl className="identity-list">
            <div>
              <dt>Patrón</dt>
              <dd>{classification.movementPattern.label}</dd>
            </div>
            <div>
              <dt>Contenido</dt>
              <dd>Utilizable · primera versión</dd>
            </div>
            <div>
              <dt>Media</dt>
              <dd>{media.status === "missing" ? "Pendiente" : "Parcial"}</dd>
            </div>
          </dl>
        </div>
        <div className="exercise-hero__media">
          {media.masterImage.src ? (
            <img src={media.masterImage.src} alt={media.masterImage.alt ?? ""} />
          ) : (
            <ExerciseMediaPlaceholder exercise={exercise} />
          )}
        </div>
      </header>

      {/* Resumen siempre visible */}
      <ExerciseOverview exercise={exercise} />

      {/* Barra de pestañas para revelación progresiva */}
      <div
        className="tabs-nav detail-tabs-nav"
        role="tablist"
        aria-label="Secciones del detalle del ejercicio"
      >
        {DETAIL_TABS.map((tab, index) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              className={`tabs-nav__item ${isActive ? "tabs-nav__item--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              <ForjaIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pestaña 1: Prescripción y uso */}
      {activeTab === "prescription" && (
        <section
          id="tabpanel-prescription"
          role="tabpanel"
          aria-labelledby="tab-prescription"
          className="tab-panel"
        >
          <section className="detail-section detail-section--objective">
            <DetailHeading eyebrow="Propósito" title="Objetivo" />
            <p className="objective-copy">{identity.objective}</p>
          </section>

          <section className="detail-section">
            <DetailHeading
              eyebrow="Dosificación"
              title="Prescripción"
              description="Variables aplicables a esta tarea. Los valores concretos dependen del objetivo y del contexto."
            />
            <div className="metrics-grid">
              {prescription.variables.map((metric) => (
                <PrescriptionMetric
                  key={`${metric.kind.type}-${metric.kind.key}`}
                  metric={metric}
                />
              ))}
            </div>
            {prescription.contextualExample.length > 0 && (
              <div className="context-example">
                <h3>Ejemplo contextual</h3>
                <ul>
                  {prescription.contextualExample.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
                <p>
                  <ForjaIcon name="observe" size={19} />
                  {prescription.contextNote}
                </p>
              </div>
            )}
          </section>

          {stopCriteriaItems.length > 0 && (
            <section className="detail-section">
              <DetailHeading
                eyebrow="Seguridad técnica"
                title="Criterios de parada"
                description="Situaciones que exigen detener la serie o la tarea de inmediato."
              />
              <ContentPanel
                title="Criterios de parada y advertencias"
                icon="quality"
                items={stopCriteriaItems}
                tone="danger"
              />
            </section>
          )}
        </section>
      )}

      {/* Pestaña 2: Técnica y claves */}
      {activeTab === "technique" && (
        <section
          id="tabpanel-technique"
          role="tabpanel"
          aria-labelledby="tab-technique"
          className="tab-panel"
        >
          {(coaching.setup.length > 0 || contextItems.length > 0) && (
            <section className="detail-section">
              <DetailHeading eyebrow="Antes de empezar" title="Preparación" />
              <div className="coaching-grid coaching-grid--two">
                <ContentPanel
                  title="Preparar la tarea"
                  icon="sets"
                  items={coaching.setup}
                />
                <ContentPanel
                  title="Requisitos y contexto"
                  icon="observe"
                  items={contextItems}
                />
              </div>
            </section>
          )}

          <section className="detail-section">
            <DetailHeading eyebrow="Ejecución" title="Cómo realizarla" />
            <div className="instruction-layout">
              <ol className="instruction-steps">
                {coaching.execution.map((item, index) => (
                  <li key={`${index}-${item}`}>
                    <span>{index + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
              <ContentPanel
                title="Consignas posibles"
                icon="quality"
                items={coaching.cues}
                tone="success"
              />
            </div>
          </section>

          <section className="detail-section">
            <DetailHeading
              eyebrow="Observación"
              title="Coaching"
              description="Indicadores para valorar la tarea sin exigir una solución estética universal."
            />
            <div className="coaching-grid coaching-grid--two">
              <ContentPanel
                title="Indicadores de competencia"
                icon="competence"
                items={coaching.competencyIndicators}
                tone="success"
              />
              <ContentPanel
                title="Errores relevantes"
                icon="modifyTask"
                items={coaching.commonErrors}
                tone="danger"
              />
              <ContentPanel
                title="Variabilidad aceptable"
                icon="observe"
                items={coaching.acceptableVariations}
                tone="warning"
              />
              <ContentPanel
                title="Seguridad y parada"
                icon="quality"
                items={stopCriteriaItems}
              />
            </div>
          </section>
        </section>
      )}

      {/* Pestaña 3: Modificaciones y criterio */}
      {activeTab === "relations" && (
        <section
          id="tabpanel-relations"
          role="tabpanel"
          aria-labelledby="tab-relations"
          className="tab-panel"
        >
          <section className="detail-section">
            <DetailHeading
              eyebrow="Red de decisiones"
              title="Modificar la tarea"
              description="Las relaciones proceden de la ficha documental; no representan una progresión universal."
            />
            <div className="relations-grid relations-grid--adaptive">
              <RelationGroup
                title="Regresiones"
                icon="makeMoreAccessible"
                items={relations.regressions}
              />
              <RelationGroup
                title="Progresiones"
                icon="increaseDemand"
                items={relations.progressions}
              />
              <RelationGroup
                title="Sustituciones"
                icon="modifyTask"
                items={relations.substitutions}
              />
              <RelationGroup
                title="Variantes"
                icon="range"
                items={relations.variations}
              />
              <RelationGroup
                title="Ejercicios relacionados"
                icon="coordination"
                items={relations.relatedExercises}
              />
            </div>
          </section>

          {whatToRecord.length > 0 && (
            <section className="detail-section">
              <DetailHeading eyebrow="Seguimiento" title="Qué registrar" />
              <ContentPanel
                title="Información útil para decidir"
                icon="sets"
                items={whatToRecord}
              />
            </section>
          )}

          {methodological.length > 0 && (
            <section className="detail-section">
              <DetailHeading eyebrow="Criterio FORJA" title="Notas metodológicas" />
              <ContentPanel
                title="Selección y trazabilidad"
                icon="observe"
                items={methodological}
              />
            </section>
          )}
        </section>
      )}

      {/* Glosario consultable sin salir de la ficha (F3-03) */}
      {relevantGlossaryTerms.length > 0 && (
        <section
          className="detail-section detail-section--glossary"
          aria-label="Glosario metodológico"
          role="region"
        >
          <DetailHeading
            eyebrow="Metodología"
            title="Términos del glosario en esta ficha"
            description="Conceptos y decisiones metodológicas aplicables a esta tarea. Consulta sus definiciones oficiales sin salir de la ficha."
          />
          <div className="glossary-chips-grid">
            {relevantGlossaryTerms.map((term) => (
              <GlossaryTermChip
                key={term.id}
                termName={term.title}
                onOpenTerm={setInspectedTerm}
                label={
                  term.acronym
                    ? `${term.acronym} — ${term.title.split("—")[1]?.trim() ?? term.title}`
                    : term.title
                }
              />
            ))}
          </div>
        </section>
      )}

      <GlossaryDrawer
        term={inspectedTerm}
        onClose={() => setInspectedTerm(null)}
        onSelectTerm={setInspectedTerm}
      />
    </article>
  );
}
