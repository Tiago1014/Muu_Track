Vamos a construir el MVP de **Muu Track**. Todo lo que tiene que hacer la app está en @MuuTrack_PRD.md, que está en esta carpeta. Leelo completo antes de empezar: es la fuente de verdad, y si algo de lo que te pido acá choca con el PRD, preguntame.

## 1. Repositorio en GitHub
1. Fijate que `git` y `gh` estén instalados y que `gh auth status` muestre una sesión iniciada. Si falta algo, frená y decime qué tengo que hacer.
2. Inicializá git en esta carpeta y creá un repositorio nuevo en GitHub llamado **"Muu Track"**. GitHub no acepta espacios, así que el nombre queda **`Muu-Track`**: `gh repo create Muu-Track --private --source=. --remote=origin`.
3. Mové el PRD a `docs/PRD.md` y creá un `CLAUDE.md` corto que diga que `docs/PRD.md` es la fuente de verdad y resuma el stack y los comandos.
4. Primer commit y push a `main`.

## 2. Stack
- Vite + React + TypeScript + Tailwind CSS.
- React Router para las pantallas y Recharts para el gráfico de la ficha.
- `vite-plugin-pwa` para que funcione sin conexión de verdad: después de abrirla una vez, tiene que andar en modo avión.
- Datos en localStorage. Sin backend, sin login y sin llamadas a internet en tiempo de uso, ni siquiera fuentes externas.
- Vitest para tests de la lógica y Playwright para probar el flujo en un viewport de celular (390×844).

## 3. Cómo trabajar
1. **Primero el plan.** Antes de escribir código, mostrame un plan corto con la estructura de carpetas, el modelo de datos, cómo generás los datos de ejemplo con semilla fija y el orden de las pantallas. Esperá mi ok.
2. **Lógica primero, con tests.** Implementá los datos de ejemplo y las reglas de negocio del PRD (secciones 5 y 6) como funciones puras, con tests que verifiquen:
   - Hay 90 animales y los grupos dan 5 / 81 / 4.
   - La caravana 1234 es un novillo atrasado.
   - Los listos son 3 novillos y 2 terneros.
   - El Potrero Chico tiene más de 45 días sin pesar.
   - El peso simulado y el rango ±10% se calculan bien.
3. **Después las pantallas,** en el orden del flujo: Inicio → Buscar animal → Medir → Resultado → Ficha → Rodeo, y por último Reiniciar demo.
4. **Commits chicos y con mensaje claro** al terminar cada parte, y push al final de cada una.

## 4. Verificación antes de decir que terminaste
- `npm run build` sin errores y todos los tests en verde.
- Un test de Playwright que haga el flujo completo en viewport de celular: buscar la caravana 1234, medir (con la cámara simulada), guardar, ver la ficha y llegar al Rodeo. Sacá capturas de cada pantalla y guardalas en `docs/capturas/`.
- Revisá que ninguna pantalla muestre precios ni las palabras prohibidas del PRD.
- Probá el modo sin conexión: build de producción + preview, y en Playwright cortá la red y recargá.

## 5. Publicación
Configurá GitHub Pages con una GitHub Action que publique en cada push a `main`. Tené en cuenta el `base` de Vite para la ruta `/Muu-Track/` y usá rutas compatibles con Pages (HashRouter, o el truco del 404). La cámara necesita HTTPS y Pages ya lo da. Al final, pasame el link para abrirla en el celular.

## 6. Lo que no tenés que hacer
No agregues funciones que no estén en el PRD (sección 9, "Fuera de alcance"). Si algo te parece que falta, anotalo en `docs/PENDIENTES.md` y seguí.
