# Muu Track: PRD del MVP

**Equipo:** Negocios Digitales, ORT · **Versión:** 2 (para Claude Code) · **Fecha:** 08/10/2026

> Este documento es la fuente de verdad del MVP. Si algo del código contradice este PRD, manda el PRD.

## 1. Para qué es este MVP
No es el producto final. Es un prototipo para mostrar en entrevistas de 20 a 30 minutos con productores ganaderos familiares, y sirve para validar tres cosas:
1. Si entienden la idea sin explicación.
2. Si la usarían para una decisión concreta (cuándo vender o qué animal separar).
3. Si aceptarían probarla en su campo.

El peso es **simulado**, pero la experiencia tiene que parecerse a la real: apuntar el celular al animal y que en un par de segundos aparezca el peso, al estilo Scanabull. La demo se muestra en un celular del equipo.

## 2. Usuario
- **Quién:** productor ganadero familiar de Uruguay, de ciclo completo (vacas, terneros, novillos y vaquillonas), con un rodeo de 50 a 150 animales y hasta 2 empleados. Con los animales trabaja el dueño o su familia.
- **Cómo es con la tecnología:** usa WhatsApp, poco más. No quiere menús ni palabras técnicas.
- **Qué hace hoy:** casi no pesa porque la balanza es cara y complicada. Decide a ojo cuándo vender y qué animal anda mal.
- **Qué decisión queremos que tome con la app:** *"¿Qué animales ya puedo vender y cuáles no están engordando?"*

## 3. Flujo principal (en menos de 2 minutos y sin ayuda)
1. **Inicio:** toca el botón grande **"Pesar un animal"**.
2. **Buscar animal:** escribe el número de caravana con un teclado numérico grande, o lo elige de "Últimos pesados".
3. **Medir:** se abre la cámara con una silueta de vacuno de guía. Toca **"Medir"** y aparece "Midiendo…" durante unos 2 segundos.
4. **Resultado:** ve, por ejemplo, **"420 kg ± 10%"** junto a la aclaración *"Es una estimación. No reemplaza la balanza oficial."* También ve cuánto ganó desde el último pesaje. Puede marcar notas y toca **"Guardar"**.
5. **Ficha del animal:** ve un gráfico de peso por fecha, los kilos que gana por día y sus notas.
6. **Rodeo:** ve los animales en 3 grupos: **Listos para vender**, **Creciendo bien** y **Atrasados**.
7. **Avisos:** en el inicio aparece por lo menos un aviso que lleva a una decisión concreta.

## 4. Requisitos generales
- Toda la interfaz va en español rioplatense, con voseo ("Pesá", "Tocá") y lenguaje de campo. Nunca usar "dashboard", "IA", "LiDAR", "SaaS" ni "analytics".
- Pensada para un celular en vertical, usada con una mano y al sol: botones de al menos 56 px de alto, texto base de 18 px, alto contraste, fondo claro y un color principal verde campo.
- Navegación con barra inferior de 3 ítems: **Inicio**, **Pesar** y **Rodeo**.
- **No se muestran precios** ni montos de dinero en ninguna pantalla.
- **Funciona sin conexión:** después de abrirla una vez con internet, tiene que andar en modo avión. Los datos se guardan en el propio celular.
- Sin backend, sin login y sin servicios externos en tiempo de uso.

## 5. Datos de ejemplo
Se generan con una semilla fija, para que siempre salgan iguales. Es un rodeo de **90 animales** de ciclo completo:
- 35 vacas (6 marcadas como "descarte"), 30 terneros/as, 15 novillos y 10 vaquillonas.
- Cada animal tiene:
  - Número de caravana de 4 dígitos (entre 1000 y 9999, sin repetir).
  - Categoría, sexo y edad aproximada en meses.
  - Potrero: "Potrero del Monte", "La Cañada", "El Bajo" o "Potrero Chico".
  - Una lista de pesajes.
- Cada animal tiene entre 4 y 6 pesajes, separados entre 30 y 45 días, desde abril de 2026 hasta la fecha de hoy.
- Ganancia diaria normal: terneros 0,6 a 0,9 kg/día; novillos y vaquillonas 0,4 a 0,7 kg/día; vacas cerca de 0.
- Algunos pesajes tienen notas: "Vacunado", "Desparasitado", "Rengo", "Preñada" u "Otro".
- Nombre del productor en la demo: "Don Carlos".

**Casos que tienen que estar sí o sí:**
- Exactamente **5 animales listos para vender** (3 novillos y 2 terneros).
- Exactamente **4 animales atrasados**. Uno es la caravana **1234**, un novillo que no ganó peso en los últimos 60 días.
- El resto (81) queda en "Creciendo bien".
- El Potrero Chico no se pesa hace más de 45 días.

## 6. Reglas de negocio
- **Peso de venta por categoría:** ternero/a 180 kg, novillo 470 kg, vaquillona 380 kg y vaca de descarte 420 kg.
- **Listos para vender:** último peso mayor o igual al peso de venta de su categoría.
- **Atrasados:** ganancia menor a 0,2 kg/día en los últimos 60 días, con al menos 3 pesajes. No se aplica a vacas que no son de descarte. Usamos 60 días y no 30 porque, con un error de ±10% (unos ±40 kg en un novillo), un animal gana en 30 días menos kilos que el propio error.
- **Creciendo bien:** el resto.
- **Ganancia diaria:** (último peso − peso de hace unos 60 días) ÷ días entre esos dos pesajes. Si no hay pesajes en esa ventana, se usan los dos últimos.
- **Peso simulado al medir:** último peso + ganancia diaria típica del animal × días desde el último pesaje, más una variación aleatoria de ±2%. Para un animal nuevo, se usa un peso típico de su categoría. El rango que se muestra es ±10% del peso estimado.

## 7. Pantallas
| # | Pantalla | Contenido |
|---|----------|-----------|
| 1 | **Inicio** | Saludo "Buen día, Don Carlos" y botón grande **"Pesar un animal"**. Sección **"Avisos"** con tarjetas que se pueden tocar: (a) "5 animales llegaron al peso de venta. Tocá para verlos.", que lleva al Rodeo filtrado; (b) "El animal 1234 no ganó peso en 60 días. Conviene revisarlo.", que lleva a su ficha; (c) "Hace más de 45 días que no pesás el Potrero Chico." Abajo, **"Tu rodeo"**: 3 tarjetas con la cantidad de animales por grupo (verde = listos, azul = creciendo bien, naranja = atrasados), que llevan al Rodeo filtrado. |
| 2 | **Buscar animal** | Título "¿Qué animal vas a pesar?", teclado numérico grande en pantalla y lista "Últimos pesados" con 5 animales. Si la caravana no existe: "No encontramos ese número. ¿Es un animal nuevo?". Si dice que sí, se elige la categoría con 4 botones grandes. |
| 3 | **Medir** | Cámara trasera a pantalla completa (getUserMedia con facingMode "environment"). Encima, una silueta SVG blanca semitransparente de un vacuno de costado y el texto "Parate a 3 o 4 metros. Que se vea el animal entero de costado." Botón redondo **"Medir"**: una línea recorre la silueta con el texto "Midiendo…" durante unos 2 segundos y después pasa al resultado. Si no hay cámara o no hay permiso, se muestra una ilustración SVG de un novillo y la medición funciona igual. |
| 4 | **Resultado** | Caravana y categoría. Peso grande ("420 kg") y debajo "± 10% · entre 378 y 462 kg". Aviso "Es una estimación. No reemplaza la balanza oficial." Comparación: "+18 kg desde el 12/08 · gana 0,6 kg por día". Chips de notas: Vacunado, Desparasitado, Rengo, Preñada y Otro. Botones **"Guardar"** (guarda el pesaje, recalcula el grupo y abre la ficha) y **"Medir de nuevo"**. |
| 5 | **Ficha del animal** | Caravana grande, categoría, edad, potrero y etiqueta de color con su grupo. Tres datos grandes: peso actual, "Gana X kg por día" y "Le faltan X kg para venta" (o "Listo para vender"). Gráfico de línea de peso por fecha (dd/mm) con una línea punteada en el peso de venta. Lista de pesajes con fecha, peso y notas. Botón "Pesar de nuevo". |
| 6 | **Rodeo** | Pestañas **Listos para vender (5)**, **Creciendo bien (81)** y **Atrasados (4)**, más chips de categoría (Todos, Vacas, Terneros, Novillos, Vaquillonas). Cada fila muestra caravana, categoría, último peso y kg por día, y al tocarla abre la ficha. |
| — | **Reiniciar demo** | Si se mantiene apretado el logo durante 3 segundos, aparece la opción "Reiniciar demo", que borra lo guardado y vuelve a cargar los datos de ejemplo. Sirve para usar entre entrevistas. |

## 8. Qué medimos en las entrevistas (con al menos 8 productores)
| Métrica | Meta | Cómo la registramos |
|---------|------|---------------------|
| Completan los pasos 1 a 4 sin explicación | La mayoría (5 o más de 8) | Anotamos en qué paso pidieron ayuda y cuánto tardaron |
| Nombran una decisión concreta que tomarían | 5 o más | Pregunta abierta: "¿Qué harías con esto mañana?" |
| Aceptan un margen de ±10% para decidir | 5 o más | Pregunta directa después de ver el resultado |
| Aceptan un piloto en su campo | 4 o más | Pedimos el contacto y una fecha tentativa |
| Disposición a pagar (fuera de la app) | *A definir por el equipo* | Pregunta de precio al final de la entrevista |

**Para indagar además:** qué celular tienen (la versión real necesitaría un celular con sensor 3D, como un iPhone Pro) y cómo pesan hoy, si es que pesan.

## 9. Fuera de alcance
Estimación real del peso, lectura de la caravana por cámara o RFID, conexión con el SNIG, usuarios y login, varios campos, precios y mercado, exportar datos.
