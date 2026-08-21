# FORJA Exercise Image QA Checklist

## Identificación

- **Ejercicio / ID:**
- **Archivo candidato:**
- **Versión / fecha:**
- **Revisor:**
- **Production spec utilizada:**

## Anatomía

- [ ] Número correcto de extremidades, manos, dedos y pies.
- [ ] Manos y agarres completos, legibles y plausibles.
- [ ] Articulaciones anatómicamente posibles y sin deformaciones.
- [ ] Proporciones corporales consistentes entre fases.
- [ ] Rostro, cabello, ropa y calzado coherentes entre fases.

## Técnica

- [ ] Variante y fase respaldadas por ficha, brief y production spec.
- [ ] Patrón principal reconocible sin texto auxiliar.
- [ ] Equipamiento exacto en tipo, cantidad y posición.
- [ ] Agarre y relación atleta–equipamiento físicamente plausibles.
- [ ] Apoyos completos, estables y coherentes con la tarea.
- [ ] Articulaciones clave visibles.
- [ ] No aparece ninguno de los errores invalidantes de la production spec.
- [ ] La imagen no convierte una variación individual en regla universal.

## Composición

- [ ] Canvas 3:2 y master mínimo recomendado de 1536 × 1024 px.
- [ ] La imagen usa dos posturas —inicio y fin— siempre que sean suficientes para explicar el ejercicio.
- [ ] Si existe una tercera postura, aporta información técnica imprescindible, está justificada en la production spec y no repite ni casi repite la postura inicial.
- [ ] Atleta completo cuando la especificación lo requiere.
- [ ] Sin recortes accidentales de cabeza, manos, pies, articulaciones o equipo.
- [ ] Todas las partes esenciales permanecen dentro del safe area.
- [ ] Escala consistente con EX-002 y con el resto del lote.
- [ ] Separación clara entre fases y lectura izquierda–derecha cuando corresponda.
- [ ] Espacio alrededor del atleta coherente y sin vacíos arbitrarios.
- [ ] Sombras de contacto completas y atleta visualmente apoyado.

## FORJA

- [ ] Fondo blanco cálido, limpio y sin escenario.
- [ ] Tratamiento de ilustración digital realista coherente con el estándar y EX-002.
- [ ] La identidad facial coincide con FORJA Athlete Master.
- [ ] Complexión y proporciones coinciden.
- [ ] La complexión es juvenil, ligera y moderadamente atlética; no presenta hipertrofia de culturista.
- [ ] Cabello y edad aparente coinciden.
- [ ] Vestuario coincide.
- [ ] Calzado coincide.
- [ ] El fondo es blanco neutro y no crema o beige.
- [ ] Ropa y equipamiento sin marcas comerciales.
- [ ] No existen logos, escudos o símbolos falsos.
- [ ] No existe texto generado dentro del master.
- [ ] Si hay branding añadido posteriormente, usa exclusivamente `forja-symbol.svg` canónico.

## Calidad

- [ ] Nitidez suficiente en cara, manos, articulaciones, apoyos y equipo.
- [ ] Sin artefactos de generación, duplicaciones, fusiones o bordes extraños.
- [ ] Sin deformaciones de perspectiva o gran angular.
- [ ] Luz, color y contraste consistentes entre fases.
- [ ] Sombras suaves y físicamente coherentes.
- [ ] Sin zonas quemadas, negros empastados ni recortes por compresión.
- [ ] Original de alta resolución conservado separadamente del derivado optimizado.

## Resultado

Seleccionar exactamente uno:

- [ ] **APPROVED** — cumple estándar y production spec; puede incorporarse.
- [ ] **REJECTED** — contradice la documentación o contiene un defecto no reparable.
- [ ] **REGENERATE** — el concepto es válido, pero requiere nueva generación.

La consistencia con el FORJA Athlete Master es un requisito de aprobación, no una preferencia. Si cualquiera de las comprobaciones de identidad facial, complexión, proporciones, cabello, edad aparente, vestuario o calzado no se cumple, `APPROVED` queda descartado y el resultado obligatorio es `REGENERATE`, aunque la técnica del ejercicio sea correcta.

Una imagen de tres posturas cuya última postura repita o casi repita la inicial debe clasificarse como `REGENERATE`, salvo que la tercera fase aporte información técnica imprescindible expresamente justificada.

### Motivo y acciones

- **Hallazgos:**
- **Correcciones o regeneración solicitada:**
- **Ruta aprobada, si corresponde:**
