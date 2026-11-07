# 🎯 Guía del Facilitador: Torneo SPC (4 Juegos, CRUD & Ponderación Oficial)

Esta guía explica cómo dirigir la sesión usando la aplicación interactiva [index.html](file:///c:/Users/mh876/Desktop/Indugral/Programs%20python/Calidad%20SPC/index.html).

---

## ⚖️ Sistema de Puntuación & Ponderación Oficial (4 Juegos)

El torneo evalúa el conocimiento teórico/analítico, la destreza motriz, la capacidad de auditoría y el control temporal de procesos mediante 4 dinámicas complementarias:

$$\text{Puntaje Total Ponderado} = (\text{Juego 1} \times 0.30) + (\text{Juego 2} \times 0.25) + (\text{Juego 3} \times 0.25) + (\text{Juego 4} \times 0.20)$$

* **Juego 1: El Dado del Inspector (12 Casos de Análisis) $\rightarrow$ Peso: 30%**
  * Opciones de calificación directa por caso: **0, +10, +35, +50, +100 puntos**.
* **Juego 2: El Pulso del Operador (Seguidor de Proceso 15s) $\rightarrow$ Peso: 25%**
  * Puntaje en escala de **0 a 100** con **3 decimales exactos** (ej. `94.852 pts`).
* **Juego 3: Auditoría e Interpretación (15 Días con Límites) $\rightarrow$ Peso: 25%**
  * Asignación de puntos por equipo con sistema idéntico al Juego 1 (**0, +10, +35, +50, +100 pts**).
* **Juego 4: El Cronómetro de Precisión (Objetivo 10.000s) $\rightarrow$ Peso: 20%**
  * Detención de alta resolución en **3 decimales** con **Barra Espaciadora**, estado **congelado** y calificación de exactitud (ej. `98.800 pts`).

---

## 👥 Gestión de Participantes (CRUD) y Persistencia JSON Continua

En la pestaña **"🏆 Clasificación & Podio"**:
1. **➕ Crear:** Haz clic en **"➕ Nuevo Participante"** para registrar un nuevo equipo o persona.
2. **✏️ Modificar / Editar:** Haz clic en **"✏️ Editar"** junto a cualquier participante para corregir su nombre o sobreescribir manualmente sus puntajes de cualquiera de los 4 juegos.
3. **🗑️ Eliminar:** Botón **"🗑️ Eliminar"** para retirar un equipo del torneo con confirmación.
4. **💾 Guardado Continuo en JSON:**
   * **Automático en Todo Momento:** Cualquier cambio de puntaje, asignación, edición o restablecimiento se guarda instantáneamente en la base JSON (`localStorage` con respaldo estructurado).
   * **Descargar Copia JSON:** Descarga un archivo `torneo_spc_datos_YYYY-MM-DD.json` con todos los participantes y puntajes de los 4 juegos.
   * **Cargar JSON:** Permite importar un archivo JSON para reanudar el torneo en cualquier computadora.
   * **🔄 Restablecer a 0:** Coloca todos los puntajes en **0** y deja exactamente los **3 equipos por defecto** (*Línea Alfa*, *Planta Delta* y *Taller Mecatrónica*).

---

## 🎲 Juego 1: El Dado del Inspector (12 Casos de Análisis)

### Mecánica de Turno:
1. Pide al capitán del equipo en turno que presione **"🎲 Tirar Dado"**.
2. El dado gira y se detiene en un número del **1 al 12**.
3. **Únicamente se muestra en pantalla el caso sorteado**; los otros 11 casos permanecen ocultos.
4. El equipo tiene 1 minuto para analizar la gráfica o tabla numérica y dar su diagnóstico.
5. Presiona **"🔍 Revelar Diagnóstico Oficial"** para cotejar la solución industrial.
6. Califica al equipo con los chips rápidos:
   * **0 pts:** Respuesta incorrecta.
   * **+10 pts:** Intento básico o respuesta parcial.
   * **+35 pts:** Respuesta aceptable con diagnóstico correcto.
   * **+50 pts:** Buen análisis con diagnóstico y causa raíz.
   * **+100 pts:** Análisis impecable (diagnóstico, causa raíz y acción correctiva).

---

## 〰️ Juego 2: El Pulso del Operador (Seguidor de Trayectoria)

### Mecánica de Turno:
1. En el panel lateral, selecciona el equipo que va a jugar.
2. El participante presiona **"▶ Iniciar Prueba (15 Segundos)"**.
3. Mueve el mouse arriba y abajo para seguir la curva verde de proceso en movimiento durante 15 segundos continuos.
4. Al finalizar, la aplicación despliega automáticamente el diagnóstico estadístico:
   * **Puntaje Oficial (0.000 a 100.000 pts):** Con 3 decimales para desempate directo.
   * **Media del Desvío ($\bar{X}$):** Mide el sesgo hacia arriba o hacia abajo.
   * **Desviación Estándar ($\sigma$):** Mide la repetibilidad del pulso.
   * **Tendencia:** Evalúa fatiga o estabilidad a lo largo de los 15s.
   * **Rango ($R$):** Máxima diferencia de error.
5. Presiona **"💾 Registrar este Puntaje al Equipo"** para almacenar el resultado.

---

## 📈 Juego 3: Auditoría e Interpretación de Gráfica (15 Días)

### Características de la Gráfica:
* Gráfica cronológica con **15 puntos diarios** con límites de ingeniería:
  * 🔴 **LSE = 24.0 mm** (Límite Superior de Especificación)
  * 🔵 **Media Nominal ($\bar{X}$) = 20.0 mm** (Objetivo Central)
  * 🔴 **LIE = 16.0 mm** (Límite Inferior de Especificación)
* **10 Preguntas de Análisis:** Moda, tendencia, violaciones de límites, media aproximada, rango, máximos, mínimos, conteo de días no conformes, mayor variación interdiaria y dictamen de proceso.
* **Sistema de Calificación:** Idéntico al Juego 1: lista a los equipos registrados y permite asignar rápidamente **0, +10, +35, +50 o +100 puntos** directamente con guardado en tiempo real.
* **Soluciones Oficiales:** Botón **"🔍 Revelar Solución Oficial"** para revisar los cálculos matemáticos y la justificación diagnóstica.

---

## ⏱️ Juego 4: El Cronómetro de Precisión (10.000 Segundos)

### Concepto de Calidad:
En control de calidad, el centrado respecto al valor nominal ($Target = 10.000\text{s}$) y la minimización de la variabilidad son los principios clave de Seis Sigma y la Función de Pérdida de Taguchi.

### Mecánica de Turno:
1. En el panel lateral, selecciona el equipo en turno.
2. Presiona **"▶ Iniciar Cronómetro"** o la **Barra Espaciadora**.
3. El cronómetro digital avanza en tiempo real mostrando segundos y milisegundos (`SS.mmm s`).
4. Cuando el participante estime que han transcurrido exactamente **10 segundos**, debe presionar la **BARRA ESPACIADORA** (o el botón rojo de detener).
5. **Estado Congelado:**
   * Al detenerse, el cronómetro **se congela inmediatamente** con resolución de 3 decimales (ej. `10.024 s`).
   * Permanecerá **totalmente congelado** y no responderá a nuevas pulsaciones de la barra espaciadora hasta que el facilitador presione **"🔄 Reiniciar / Nuevo Intento"**.
6. **Métricas de Calidad Calculadas:**
   * **Tiempo Detenido:** ej. `9.974 s`
   * **Desviación respecto a la meta:** $\Delta = t - 10.000\text{s}$ (ej. `-0.026 s`, 26 ms de anticipación).
   * **Puntaje Asignable:** Calculado con 3 decimales:
     $$\text{Puntaje} = \max\Big(0,\; 100 - (|\Delta| \times 50)\Big)$$
   * **Veredicto SPC:**
     * $|\Delta| \le 0.050\text{s}$ (±50 ms): 🎯 *Exactitud Seis Sigma*
     * $|\Delta| \le 0.200\text{s}$ (±200 ms): ✅ *Proceso Capaz y Centrado*
     * $|\Delta| \le 0.500\text{s}$ (±500 ms): ⚠️ *Variación Aceptable*
     * $|\Delta| > 0.500\text{s}$: ❌ *Fuera de Tolerancia*
7. Presiona **"💾 Guardar Puntaje en Equipo"** para registrar los puntos en la clasificación general (peso del 20%).

---

## 🏆 Podio Final Ponderado (Desglose Transparente)

La tabla de clasificación general presenta el desglose auditado:
* **J1: Casos (30%):** Puntos base y aporte ponderado.
* **J2: Pulso (25%):** Puntos base con 3 decimales y aporte ponderado.
* **J3: Auditoría (25%):** Puntos base y aporte ponderado.
* **J4: Cronómetro (20%):** Puntos base con 3 decimales, tiempo exacto registrado y aporte ponderado.
* **Total Ponderado:** $(\text{J1} \times 0.30) + (\text{J2} \times 0.25) + (\text{J3} \times 0.25) + (\text{J4} \times 0.20)$ calculado con **3 decimales exactos** para garantizar un desempate transparente.
