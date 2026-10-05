import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import type { ProgramDay } from "../domain/program";

interface WeeklyCalendarViewProps {
  days: ProgramDay[];
}

export function WeeklyCalendarView({ days }: WeeklyCalendarViewProps) {
  const getBadgeTone = (offset: string, hasSession: boolean) => {
    if (offset === "MD") return "blue";
    if (hasSession) return "green";
    return "neutral";
  };

  return (
    <div className="weekly-calendar-view" role="region" aria-label="Calendario de la semana">
      <div className="weekly-calendar-grid">
        {days.map((day, idx) => {
          const hasSession = Boolean(day.sessionId);
          const isMatchDay = day.matchDayOffset === "MD";

          return (
            <Card
              key={`${day.dayName}-${idx}`}
              className={`calendar-day-card ${isMatchDay ? "calendar-day-card--match" : ""} ${hasSession ? "calendar-day-card--session" : ""}`}
            >
              <div className="calendar-day-card__header">
                <div>
                  <h3 className="calendar-day-card__title">{day.dayName}</h3>
                  <p className="calendar-day-card__offset">
                    <Badge tone={getBadgeTone(day.matchDayOffset, hasSession)}>
                      {day.matchDayOffset}
                    </Badge>
                  </p>
                </div>
                {isMatchDay ? (
                  <ForjaIcon name="competence" size={24} className="calendar-day-card__icon text-blue" />
                ) : hasSession ? (
                  <ForjaIcon name="strength" size={24} className="calendar-day-card__icon text-green" />
                ) : (
                  <ForjaIcon name="time" size={20} className="calendar-day-card__icon text-muted" />
                )}
              </div>

              <div className="calendar-day-card__body">
                <div className="calendar-day-block">
                  <span className="calendar-day-block__label">Actividad club / deporte:</span>
                  <p className="calendar-day-block__val">{day.clubActivity}</p>
                </div>

                <div className="calendar-day-block">
                  <span className="calendar-day-block__label">Estímulo FORJA:</span>
                  <p className="calendar-day-block__val calendar-day-block__val--stimulus">
                    {day.forjaStimulus}
                  </p>
                </div>

                <div className="calendar-day-meta">
                  <small title="Prioridad metodológica">
                    <strong>Foco:</strong> {day.priority}
                  </small>
                  <small title="Coste de fatiga">
                    <strong>Fatiga:</strong> {day.acceptableFatigue}
                  </small>
                </div>

                {day.sessionId && (
                  <div className="calendar-day-card__actions">
                    <Link
                      to={`/sessions/${day.sessionId}`}
                      className="button button--secondary button--sm"
                      aria-label={`Consultar sesión ${day.sessionId}`}
                    >
                      Ver sesión
                    </Link>
                    <Link
                      to={`/sessions/prepare?template=${day.sessionId}`}
                      className="button button--primary button--sm"
                      aria-label={`Preparar sesión ${day.sessionId}`}
                    >
                      Preparar
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
