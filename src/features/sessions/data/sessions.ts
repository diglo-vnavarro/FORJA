import type { Session, SessionTask } from "@/features/sessions/domain/session";

const task = (
  exerciseId: SessionTask["exerciseId"],
  prescription: string,
  quality: string,
  adaptations: string[],
  stopCriteria: string[],
): SessionTask => ({ exerciseId, prescription, quality, adaptations, stopCriteria });

export const sessions: Session[] = [
  {
    identity: { id: "SES-001", slug: "fuerza-inicial-aprendizaje-patrones", name: "Fuerza inicial y aprendizaje de patrones", status: "usable", version: "Primera versión" },
    purpose: "Aprender y repetir tareas sencillas de fuerza con una prioridad clara de competencia motriz.",
    primaryPriority: "Aprender y repetir con calidad patrones básicos de fuerza.",
    secondaryObjectives: ["Introducir empuje y tracción con demanda adaptable.", "Observar control, repetibilidad y tolerancia.", "Generar información para la siguiente sesión."],
    notPrioritized: ["Fatiga elevada.", "Entrenamiento al fallo.", "Variedad de ejercicios.", "Aumento de carga externa."],
    context: {
      audience: ["Jóvenes con poca experiencia en entrenamiento de fuerza."],
      requirements: ["Participación supervisada.", "Necesidad de familiarización con patrones básicos.", "Ausencia de información que obligue a detener o replantear la sesión."],
      weeklyConsiderations: ["Revisar actividad reciente y entrenamiento deportivo previsto.", "Reducir, conservar solo una parte o cambiar la prioridad si el estado actual dificulta el aprendizaje."],
      resources: ["Apoyo fijo y seguro.", "Banda y anclaje comprobado.", "Superficie estable.", "Colchoneta cuando resulte útil."],
      organization: ["Supervisión suficiente para observar la ejecución.", "Estaciones que permitan observar apoyos y eviten esperas innecesarias."],
    },
    readinessChecks: ["Revisar actividad reciente, molestias y disposición.", "Comprobar espacio, apoyo y banda.", "Explicar que la prioridad es aprender, no acumular repeticiones.", "Seleccionar una variante de flexión que permita competencia."],
    blocks: [
      {
        id: "lower-patterns", name: "Patrones de miembros inferiores", purpose: "Aprender dominante de rodilla y bisagra con baja complejidad.", tasks: [
          task("EX-001", "2–3 series de pocas repeticiones; asistencia suficiente; descenso controlado; descanso suficiente para comprender y repetir.", "Control del descenso, apoyo seguro y uso de la asistencia compatible con el aprendizaje.", ["Aumentar asistencia.", "Reducir rango o repeticiones."], ["Pérdida clara de calidad.", "Dependencia creciente de los brazos.", "Apoyo inseguro, fatiga incompatible o dolor."]),
          task("EX-003", "2–3 series de pocas repeticiones; ejecución controlada; feedback cuando sea necesario; descanso suficiente.", "Bisagra reconocible y repetible sin que la fatiga impida aprender.", ["Reducir rango.", "Añadir una referencia posterior.", "Segmentar la práctica."], ["Errores repetidos que no mejoran con feedback.", "Pérdida clara de la bisagra.", "Fatiga incompatible o dolor."]),
        ],
      },
      {
        id: "push-pull", name: "Empuje y tracción", purpose: "Practicar acciones del tren superior manteniendo margen antes del fallo.", tasks: [
          task("EX-008", "Variante competente; 2–3 series de 5–10 repeticiones; margen antes del fallo; recuperación suficiente.", "Control corporal y rango compatible con la variante elegida.", ["Elegir una variante de menor demanda.", "Reducir rango, repeticiones o series."], ["Pérdida clara de control o rango.", "Fatiga incompatible, dolor o dosis completada."]),
          task("EX-010", "2–3 series de 8–12 repeticiones; resistencia compatible con control; margen antes del fallo; recuperación suficiente.", "Anclaje seguro, tracción y retorno controlados.", ["Reducir tensión.", "Ajustar posición o dosis."], ["Anclaje inseguro o retorno incontrolado.", "Pérdida de control, fatiga incompatible, dolor o dosis completada."]),
        ],
      },
      {
        id: "trunk-control", name: "Control del tronco", purpose: "Cerrar con una tarea sencilla sin convertirla en una prueba de agotamiento.", tasks: [
          task("EX-013", "2–3 series de exposiciones breves de aproximadamente 10–20 segundos; recuperación suficiente.", "Posición controlada, apoyos seguros y respiración razonable.", ["Acortar exposiciones.", "Aumentar recuperación.", "Elegir una variante de menor demanda."], ["Pérdida clara de control.", "Apoyo inseguro.", "Fatiga que transforma la tarea, dolor o dosis completada."]),
        ],
      },
    ],
    adaptations: [
      { level: "minor", label: "Ajuste menor", items: ["Utilizar el extremo inferior de series o repeticiones.", "Ampliar la recuperación.", "Finalizar un bloque cuando la dosis ya sea suficiente."] },
      { level: "task", label: "Ajuste de tarea", items: ["Seleccionar una regresión documentada.", "Reducir rango, resistencia o complejidad conservando el objetivo."] },
      { level: "objective", label: "Ajuste de objetivo", items: ["Convertir la sesión en una exposición breve de familiarización o aplazarla si no existen condiciones para aprender."] },
    ],
    recordAfter: ["Tareas y variantes realizadas.", "Series o exposiciones completadas.", "Competencia observada en sentadilla y bisagra.", "Modificaciones y motivo.", "Molestias y RPE de sesión cuando aporte información.", "Tarea que conviene repetir."],
    traceability: { sourcePath: "docs/06-sessions/ses-001-initial-strength-and-movement-learning.md", decisions: ["F-SESS-001", "F-SESS-002", "F-SESS-005", "F-SESS-008", "F-SESS-012", "F-SESS-014", "F-DOSE-005", "F-DOSE-008", "F-DOSE-009", "F-DOSE-013", "F-DOSE-016"] },
    usageNote: "Base contextual: ser utilizable no significa que sea apropiada para todos los deportistas ni para cualquier momento de la semana.",
  },
  {
    identity: { id: "SES-002", slug: "fuerza-general-carga-externa", name: "Fuerza general con carga externa", status: "usable", version: "Primera versión" },
    purpose: "Organizar fuerza general alrededor de un patrón dominante de rodilla y una bisagra con carga, complementados por empuje, tracción y control del tronco.",
    primaryPriority: "Desarrollo general de fuerza con ejecución competente.",
    secondaryObjectives: ["Practicar empuje y tracción.", "Mantener control del tronco frente a resistencia externa.", "Observar una dosis repetible y progresable."],
    notPrioritized: ["Alcanzar el fallo muscular.", "Completar todos los patrones posibles.", "Maximizar carga o volumen.", "Producir fatiga por sí misma."],
    context: {
      audience: ["Jóvenes con competencia suficiente en sentadilla básica y bisagra."],
      requirements: ["Manipulación segura de mancuernas bajo supervisión.", "Comprensión del margen antes del fallo."],
      weeklyConsiderations: ["Revisar carga deportiva previa, proximidad de entrenamiento o competición y estado actual.", "Reducir, mover o sustituir la sesión cuando la realidad semanal lo justifique."],
      resources: ["Mancuernas.", "Suspensión con anclaje comprobado.", "Banda o cable.", "Superficie estable."],
      organization: ["Supervisión adecuada al grupo.", "Espacio suficiente para manipular cargas y circular con seguridad."],
    },
    readinessChecks: ["Revisar carga reciente, molestias y disposición.", "Confirmar competencia con menor demanda.", "Seleccionar cargas con margen antes del fallo.", "Comprobar anclajes y espacio."],
    blocks: [
      {
        id: "lower-strength", name: "Fuerza de miembros inferiores", purpose: "Proteger los dos movimientos principales antes de acumular fatiga.", tasks: [
          task("EX-002", "2–3 series de 6–8 repeticiones; carga compatible con competencia; margen antes del fallo; descanso suficiente.", "Carga estable, apoyo controlado y rango apropiado.", ["Reducir carga, dosis o rango.", "Utilizar EX-001 cuando corresponda."], ["La carga impide el objetivo.", "Pérdida repetida de control.", "Fatiga incompatible, dolor o dosis completada."]),
          task("EX-004", "2–3 series de 6–8 repeticiones; carga compatible con competencia; margen antes del fallo; descanso suficiente.", "Bisagra y manipulación segura de las mancuernas.", ["Reducir carga, rango o dosis.", "Utilizar EX-003 cuando corresponda."], ["La carga impide mantener la bisagra.", "Dificultad para manipular la carga.", "Pérdida de control, dolor o dosis completada."]),
        ],
      },
      {
        id: "push-pull", name: "Empuje y tracción", purpose: "Completar fuerza general sin competir con la prioridad principal.", tasks: [
          task("EX-008", "Variante competente; 2–3 series de 5–10 repeticiones; margen antes del fallo; recuperación suficiente.", "Control corporal y rango previsto sostenibles.", ["Usar una variante de menor demanda.", "Reducir dosis."], ["Pérdida clara de control o rango.", "Fatiga incompatible, dolor o dosis completada."]),
          task("EX-011", "2–3 series de 6–10 repeticiones; inclinación competente; margen antes del fallo; recuperación suficiente.", "Apoyo, cuerpo y recorrido controlados; anclaje seguro.", ["Modificar inclinación.", "Reducir rango, repeticiones o series."], ["Pérdida de apoyo o control.", "Problema de material.", "Fatiga incompatible, dolor o dosis completada."]),
        ],
      },
      {
        id: "rotation-control", name: "Control frente a rotación", purpose: "Añadir control sin prolongar la sesión cuando el trabajo principal ya sea suficiente.", tasks: [
          task("EX-014", "2–3 series por lado de 6–10 repeticiones controladas; resistencia que permita control; recuperación suficiente.", "Posición estable y retorno controlado de la resistencia.", ["Reducir resistencia, rango, repeticiones o series.", "Aumentar recuperación."], ["Material inseguro.", "Pérdida repetida de control.", "Fatiga que modifica la tarea, dolor o dosis completada."]),
        ],
      },
    ],
    adaptations: [
      { level: "minor", label: "Ajuste menor", items: ["Trabajar en el extremo inferior de los rangos.", "Reducir una serie complementaria.", "Ampliar recuperación.", "Mantener carga si aumentarla reduce competencia."] },
      { level: "task", label: "Ajuste de tarea", items: ["EX-002 → EX-001.", "EX-004 → EX-003.", "Usar regresiones documentadas para empuje, tracción o control."] },
      { level: "objective", label: "Ajuste de objetivo", items: ["Conservar solo una dosis breve de práctica competente o aplazar la sesión cuando el contexto no permita desarrollo."] },
    ],
    recordAfter: ["Ejercicios, variantes y cargas.", "Series y repeticiones realizadas.", "RPE/RIR cuando se utilice.", "Calidad en sentadilla y bisagra.", "Modificaciones y criterios de parada.", "Molestias y siguiente decisión."],
    traceability: { sourcePath: "docs/06-sessions/ses-002-general-strength.md", decisions: ["F-SESS-001", "F-SESS-003", "F-SESS-004", "F-SESS-007", "F-SESS-008", "F-SESS-014", "F-DOSE-005", "F-DOSE-007", "F-DOSE-008", "F-DOSE-010", "F-DOSE-014", "F-DOSE-015", "F-WEEK-001", "F-WEEK-002", "F-WEEK-004"] },
    usageNote: "La dosis realizada puede diferir de la planificada cuando la respuesta lo exija.",
  },
  {
    identity: { id: "SES-003", slug: "fuerza-breve-semana-futbol", name: "Fuerza breve compatible con una semana de fútbol", status: "usable", version: "Primera versión" },
    purpose: "Ofrecer una sesión compacta cuando la semana de fútbol deja espacio para una dosis de fuerza y control.",
    primaryPriority: "Mantener una exposición útil de fuerza con un coste acotado por la mínima dosis suficiente.",
    secondaryObjectives: ["Incluir fuerza unilateral de miembros inferiores.", "Mantener una tarea de tracción.", "Integrar agarre, marcha y control lateral del tronco."],
    notPrioritized: ["Acumular volumen.", "Terminar fatigado.", "Compensar automáticamente pocos minutos de partido.", "Sustituir la evaluación semanal."],
    context: {
      audience: ["Jóvenes futbolistas con una ventana breve supervisada."],
      requirements: ["Competencia básica en split squat, remo con banda y transporte de carga.", "Manipulación segura de una mancuerna."],
      weeklyConsiderations: ["Revisar entrenamientos, partidos, minutos y participación real.", "Considerar otras sesiones, sueño, colegio, viajes y estado al llegar.", "Un hueco disponible puede seguir siendo descanso."],
      resources: ["Mancuerna.", "Banda y anclaje comprobados.", "Recorrido despejado.", "Superficie estable."],
      organization: ["Supervisión suficiente.", "Espacio para transportar y depositar la carga con seguridad."],
    },
    readinessChecks: ["Confirmar exposición deportiva real.", "Revisar molestias, energía y disposición.", "Comprobar anclaje y recorrido.", "Elegir cargas conservadoras.", "Cambiar la prioridad si la información actual lo exige."],
    blocks: [
      {
        id: "unilateral-strength", name: "Fuerza unilateral", purpose: "Proteger la tarea de mayor demanda coordinativa antes de acumular fatiga.", tasks: [
          task("EX-005", "2 series por lado de 6–8 repeticiones; carga compatible con competencia; margen antes del fallo; recuperación suficiente.", "Equilibrio, posición y control repetibles.", ["Usar peso corporal o asistencia.", "Reducir rango o ampliar la base."], ["Pérdida clara de equilibrio o control.", "Posición no sostenible.", "Fatiga incompatible, dolor o dosis completada."]),
        ],
      },
      {
        id: "pull", name: "Tracción", purpose: "Mantener fuerza de tren superior con demanda ajustable.", tasks: [
          task("EX-010", "2 series de 8–12 repeticiones; resistencia compatible con control; margen antes del fallo; recuperación suficiente.", "Anclaje seguro, tracción y retorno controlados.", ["Reducir tensión.", "Ajustar posición o repeticiones."], ["Anclaje inseguro.", "Pérdida de control o retorno incompatible.", "Fatiga que altera la tarea, dolor o dosis completada."]),
        ],
      },
      {
        id: "unilateral-carry", name: "Transporte unilateral", purpose: "Añadir marcha, agarre y control solo si todavía aporta valor.", tasks: [
          task("EX-015", "2 series; recorrido breve por lado; aproximadamente 10–20 m cuando el espacio lo permita; carga que preserve control; recuperación suficiente.", "Marcha estable, recorrido despejado, agarre y depósito seguros.", ["Reducir carga o distancia.", "Ampliar recuperación.", "Eliminar el bloque si ya no aporta valor."], ["Dolor o pérdida de agarre.", "Riesgo de caída o tropiezo.", "Fatiga que cambia la marcha o dosis completada."]),
        ],
      },
    ],
    adaptations: [
      { level: "minor", label: "Ajuste menor", items: ["Elegir el extremo inferior de repeticiones o distancia.", "Reducir carga.", "Ampliar recuperación.", "Eliminar el tercer bloque si la dosis ya es suficiente."] },
      { level: "task", label: "Ajuste de tarea", items: ["Usar una regresión documentada de EX-005.", "Ajustar la resistencia del remo.", "Sustituir solo por una tarea documentada que conserve el objetivo."] },
      { level: "objective", label: "Ajuste de objetivo", items: ["Convertir en práctica breve de menor demanda o priorizar descanso cuando el coste previsto no sea apropiado."] },
    ],
    recordAfter: ["Contexto deportivo y exposición relevante.", "Ejercicios, cargas y variantes.", "Series, repeticiones o recorridos.", "RPE/RIR cuando aporte información.", "Cambios y motivo.", "Molestias, calidad y siguiente decisión."],
    traceability: { sourcePath: "docs/06-sessions/ses-003-short-football-compatible-strength.md", decisions: ["F-SESS-008", "F-SESS-010", "F-SESS-011", "F-SESS-012", "F-SESS-014", "F-SESS-016", "F-DOSE-004", "F-DOSE-005", "F-DOSE-009", "F-DOSE-011", "F-DOSE-014", "F-DOSE-015", "F-WEEK-001", "F-WEEK-002", "F-WEEK-003", "F-WEEK-004", "F-WEEK-010", "F-WEEK-011", "F-WEEK-016", "F-WEEK-017"] },
    usageNote: "Compatible con fútbol no significa automáticamente apropiada: la carga semanal real conserva prioridad sobre el plan.",
  },
];

export const getSessionById = (value: string) => sessions.find((session) => session.identity.id.toLowerCase() === value.toLowerCase() || session.identity.slug === value);
