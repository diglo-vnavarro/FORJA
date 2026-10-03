# Activos visuales de ejercicios

Los activos se organizarán por ejercicio y nivel visual:

```text
assets/exercises/ex-0NN/
├── source/    # imagen original de la que se deriva el master
├── master/    # ilustración maestra (Nivel 1)
├── web/       # infografía, miniatura y derivados web (Nivel 2)
└── session/   # ficha rápida de sesión (Nivel 3)
```

No se crean carpetas vacías ni archivos de relleno. Un derivado candidato puede
incorporarse antes de su aprobación, pero se registra como `DRAFT` en el
[manifest de activos](../manifest.md) hasta superar la revisión visual humana.

La convención y el estado de producción se definen en [VIS-002](../../docs/05-exercises/visual-production-system.md).
