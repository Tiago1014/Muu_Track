# Muu Track

MVP de un prototipo para mostrar en entrevistas con productores ganaderos de Uruguay.
**`docs/PRD.md` es la fuente de verdad.** Si algo del código lo contradice, manda el PRD.
Lo que quede fuera del PRD (sección 9) se anota en `docs/PENDIENTES.md`, no se implementa.

## Stack
Vite + React + TypeScript + Tailwind CSS 4, React Router (HashRouter), Recharts, vite-plugin-pwa.
Datos en localStorage. Sin backend, sin login, sin servicios externos en tiempo de uso (ni fuentes).
Tests: Vitest (lógica en `src/domain`) y Playwright (flujo en viewport 390×844).

## Comandos
- `npm run dev`: servidor de desarrollo
- `npm run build`: chequeo de tipos + build de producción
- `npm test`: tests de la lógica
- `npm run preview`: ver el build (ruta `/Muu_Track/`)

## Reglas del proyecto
- Interfaz en español rioplatense con voseo. Nunca "dashboard", "IA", "LiDAR", "SaaS" ni "analytics".
- Sin precios ni montos de dinero en ninguna pantalla.
- Fecha de referencia de la demo fija: 08/10/2026 (para que los datos salgan siempre iguales).
- Commits chicos, con mensaje claro en español; push a `main` al terminar cada parte.
- El repo en GitHub es `Tiago1014/Muu_Track` (con guion bajo); Pages sirve en `/Muu_Track/`.
