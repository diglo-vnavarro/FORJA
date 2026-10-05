# Normas editoriales de FORJA

Este documento reúne las normas editoriales y de contenido aplicables a toda la
documentación de FORJA (científica, metodológica y técnica). Su propósito es
garantizar la coherencia, el rigor, la claridad y la accesibilidad de todo el
material producido en el repositorio.

Complementa los [principios de FORJA](principles.md) y los
[niveles de evidencia](evidence-levels.md).

---

## 1. Reglas editoriales generales

1. **Idioma principal**: español. Se utilizarán términos en otros idiomas solo
   cuando sean denominaciones canónicas en la literatura científica o deportiva
   (por ejemplo, *split squat*, *RPE*), registrando su definición en el
   [glosario](glossary.md).
2. **Formato**: Markdown estándar con sabor GitHub (GFM).
3. **Títulos descriptivos**: orientados al contenido del documento o sección,
   evitando títulos vagos («General», «Varios») o promocionales.
4. **Autonomía del documento**: cada documento debe poder comprenderse por sí
   mismo sin depender de una conversación externa, hilo de chat o conocimiento
   tácito previo.
5. **Tono y estilo**:
   - Sobrio, preciso, comprensible y no sensacionalista.
   - Evitar frases promocionales, superlativos injustificados y repeticiones.
   - Sin emojis en la documentación técnica, metodológica o científica.
6. **Líneas y legibilidad**: mantener párrafos enfocados y líneas razonablemente
   cortas cuando favorezca la revisión en diferencias de Git (*diffs*).
7. **Enlaces**: utilizar siempre enlaces relativos entre documentos del
   repositorio para permitir la navegación sin conexión y la integridad ante
   migraciones.

---

## 2. Reglas de contenido y rigor metodológico

1. **Sin fabricación de fuentes**: no inventar referencias científicas, autores
   ni conclusiones bibliográficas. Toda cita debe corresponder a un estudio real
   y verificable.
2. **Separación de niveles de conocimiento**: distinguir explícitamente, según
   los [niveles de evidencia](evidence-levels.md):
   - evidencia científica (metaanálisis, ensayos controlados, consensos);
   - consenso profesional y recomendaciones de organizaciones de referencia;
   - decisión metodológica propia de FORJA;
   - hipótesis pendiente de validación o ensayo.
3. **No presentar opiniones como hechos demostrados**: las posturas de escuelas
   de entrenamiento o autores individuales deben identificarse como tales.
4. **Prudencia ante la variabilidad individual**: evitar afirmaciones
   categóricas o recetas universales cuando existan incertidumbre, diferencias de
   maduración biológica o trayectorias dispares de desarrollo motor.
5. **Prioridad del bienestar a largo plazo**: priorizar siempre la salud, la
   educación motriz y el desarrollo físico a largo plazo sobre el rendimiento o
   la fatiga inmediata.
6. **Prescripción individualizada**: no prescribir cargas ni intensidades
   únicamente a partir de la edad cronológica. La edad biológica, el historial de
   entrenamiento y la competencia técnica prevalecen.
7. **Justificación de ejercicios**: no introducir un ejercicio en el catálogo
   sin explicar su propósito, contexto de aplicación, criterios técnicos de
   calidad y criterios de parada.
8. **Alcance controlado**: no ampliar el alcance del proyecto ni introducir
   módulos no previstos sin registrar la correspondiente decisión en
   [`docs/00-project/decisions.md`](../00-project/decisions.md).

---

## 3. Terminología y glosario

- Los términos técnicos especializados deben definirse en el
  [glosario](glossary.md).
- Debe mantenerse una terminología unificada en toda la documentación y en la
  interfaz de usuario (por ejemplo, «sesión» de entrenamiento, «bloque»,
  «tarea», «consigna»).
- Evitar sinónimos confusos para conceptos canónicos ya establecidos en el
  sistema.

---

## 4. Tratamiento de casos y privacidad

1. **Separación estricta**: la documentación metodológica general nunca incluirá
   datos personales identificables ni historiales clínicos individuales.
2. **Ubicación de ejemplos**: los casos y ejemplos personales se mantendrán
   exclusivamente en el directorio `examples/`.
3. **Anonimización**: no se publicarán nombres completos, identificadores
   personales ni datos de salud sensibles no indispensables para ilustrar el caso
   pedagógico.

---

## 5. Criterios de aceptación editorial en pull requests

Toda propuesta de cambio documental debe cumplir con:

- [ ] Propósito claro y delimitado.
- [ ] Distinción rigurosa entre evidencia científica y metodología práctica.
- [ ] Citas y fuentes válidas enlazadas o referenciadas con precisión.
- [ ] Coherencia con el glosario oficial.
- [ ] Enlaces relativos funcionales que superen `npm run check:links`.
- [ ] Ausencia de información personal fuera de `examples/`.
- [ ] Ausencia de emojis y lenguaje publicitario.
