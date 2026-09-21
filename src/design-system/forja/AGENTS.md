# AGENTS.md — FORJA visual system

These instructions apply to the entire repository.

## Mandatory visual rules
1. FORJA brand assets are canonical. Never redraw, regenerate or substitute:
   - `brand/forja-symbol.svg`
   - `brand/forja-wordmark.svg`
   - `brand/forja-lockup-horizontal.svg`
2. All semantic application icons MUST go through `ForjaIcon`.
3. Do NOT import Tabler icons directly inside feature/page components.
4. Do NOT add Lucide, Material Icons, Font Awesome, Phosphor or another icon library
   without an explicit design-system decision.
5. If a new semantic icon is needed:
   - first look for an existing `ForjaIconName`;
   - if none exists, add exactly one mapping in the design-system layer;
   - do not improvise an icon in the consuming screen.
6. Use CSS variables from `forja-tokens.css`. Do not hardcode FORJA brand colors when a token exists.
7. Geometry is immutable. Color is themeable.
8. Default icon stroke is 1.8 unless a component specification explicitly overrides it.

## Required implementation pattern
```tsx
<ForjaIcon name="strength" />
<ForjaIcon name="rpe" />
```

Never:
```tsx
<IconBarbell />
<SomeRandomIcon />
```

## Validation
After visual-system changes:
- run typecheck;
- run lint;
- run existing tests;
- visually verify icon alignment at 16, 24 and 32 px.
