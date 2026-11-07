# 📈 Misión SPC: El Desafío de las Gráficas de Calidad (7 Niveles)

Juego interactivo y didáctico para el aprendizaje de **Control Estadístico de Procesos (SPC) y Análisis de Capacidad**, enfocado en la **interpretación visual de gráficas de calidad en planta**. Diseñado especialmente para operarios, inspectores y personal no técnico en lenguaje natural, claro y sin fórmulas matemáticas intimidantes.

La aplicación guarda todo el progreso, puntajes y auditoría en **Neon PostgreSQL** en tiempo real.

---

## 🎯 Estructura Pedagógica del Juego (7 Niveles)

En cada nivel:
1. **📖 Módulo de Aprendizaje Previo**:
   * **Paso 1:** ¿Qué significa el concepto en palabras sencillas y cotidianas?
   * **Paso 2:** Analogía del piso de planta (la diana de dardos, el carro en el garaje, el espejo retrovisor).
   * **Paso 3:** ¿Cómo se interpreta visualmente en la gráfica con diagramas explicativos?
   * **Paso 4:** Regla de oro práctica para aplicar en su puesto de trabajo.
2. **🎯 3 Ejercicios Prácticos con Gráficas SVG Interactivas**:
   * Cartas de control temporal (Niveles 1 al 5).
   * Campanas de Gauss y tolerancias tipo "Carro en el Garaje" (Niveles 6 y 7).
3. **🔄 Regla de Dominio**:
   * Para superar el nivel se deben acertar los **3 ejercicios (3/3)**.
   * Si el participante comete un error, el nivel se reinicia para repasar la lección y garantizar el aprendizaje.

---

### Los 7 Niveles:

* **Nivel 1: La Media ($\bar{X}$) – *El Centro de la Diana***
  * ¿Hacia dónde apunta la máquina? Centrado del proceso, regalos de producto por sobrellenado vs quejas por falta de contenido, desplazamientos de media.
* **Nivel 2: Rango ($R$) y Desviación ($\sigma$) – *El Disparo Agrupado vs El Escopetazo***
  * Medir la dispersión. Cálculo rápido del Rango (Máximo - Mínimo), consistencia entre turnos y pérdida de repetibilidad.
* **Nivel 3: Límites de Especificación ($LEI$ y $LES$) – *La Ficha Técnica***
  * Cumplimiento de la Ficha Técnica entre el Límite de Especificación Inferior ($LEI$) y el Límite de Especificación Superior ($LES$).
* **Nivel 4: Tendencias y Patrones – *Escuchando los Avisos de la Máquina***
  * 7 puntos consecutivos en subida (desgaste de cuchilla / calentamiento), 8 puntos a un mismo lado de la meta (cambio de materia prima o turno), y sobrecontrol en zigzag.
* **Nivel 5: Diagnóstico Maestro – *¿Qué Decisión Tomamos en Planta?***
  * Criterio operativo: Variación común (*¡no tocar la máquina!*) vs Causa especial (*¡detener, investigar y corregir!*).
* **Nivel 6: Capacidad Potencial ($Cp$) – *¿Cabe el Carro en el Garaje?***
  * Relación entre el ancho de especificación ($LES - LEI$) y la variación natural de la máquina ($6\sigma$). ¿La máquina cabe dentro del garaje? $Cp < 1.0$ (no cabe) vs $Cp \ge 1.33$ (holgura segura).
* **Nivel 7: Capacidad Real y Centrado ($Cpk$) – *Aparcar sin Rayar los Espejos***
  * ¿Dónde parqueó el operario el carro? Distancia hacia el límite más cercano ($LEI$ o $LES$). Diferencia clave: proceso con $Cp$ alto pero $Cpk$ bajo por estar descentrado. La meta: $Cp = Cpk \ge 1.33$.

---

## 💾 Base de Datos Neon PostgreSQL

* **Variable de entorno requerida (`.env` o panel de Render)**:
  `DATABASE_URL=postgresql://<usuario>:<password>@<host>.neon.tech/<db>?sslmode=require`
* **Esquema**: `misionspc`
* **Tablas**:
  * `misionspc.spc_game_players`: Jugadores, ID, puntaje (hasta 700 pts), nivel actual (1 a 7) y reintentos.
  * `misionspc.spc_game_logs`: Auditoría de cada nivel intentado y respuestas.

---

## 🚀 Cómo Iniciar el Juego

```bash
cd "Juego1"
npm start
```
Abre en tu navegador:
👉 **`http://localhost:3001`**
