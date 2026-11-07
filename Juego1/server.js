'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración Neon desde variable de entorno DATABASE_URL (sin credenciales en código fuente)
const NEON_CONN_STR = process.env.DATABASE_URL || '';

function getNeonHttpEndpoint(connStr) {
  if (process.env.NEON_HTTP_ENDPOINT) return process.env.NEON_HTTP_ENDPOINT;
  try {
    const u = new URL(connStr);
    return `https://${u.hostname}/sql`;
  } catch (e) {
    return '';
  }
}

const NEON_HTTP_ENDPOINT = getNeonHttpEndpoint(NEON_CONN_STR);

// Función para ejecutar SQL en Neon a través de HTTPS (Puerto 443)
// Esto garantiza que funcione en cualquier red corporativa o de planta (evita bloqueos del puerto 5432)
async function neonQuery(sql, params = []) {
  if (!NEON_CONN_STR || !NEON_HTTP_ENDPOINT) {
    throw new Error('DATABASE_URL no está configurada en las variables de entorno (.env o Render).');
  }
  const cleanConn = NEON_CONN_STR.replace(/([?&])channel_binding=[^&]*(&|$)/g, '$1').replace(/[?&]$/, '');
  const res = await fetch(NEON_HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Neon-Connection-String': cleanConn,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: sql,
      params: params
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Neon HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return {
    rows: data.rows || [],
    rowCount: data.rowCount || 0
  };
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inicializar tablas en Neon dentro del esquema misionspc / public
async function initDb() {
  try {
    console.log('🔗 Verificando tablas en Neon PostgreSQL (vía HTTPS seguro)...');
    try {
      await neonQuery('CREATE SCHEMA IF NOT EXISTS misionspc');
      await neonQuery('GRANT ALL ON SCHEMA public TO misionspc');
    } catch (e) {
      // Ignorar si ya está concedido
    }

    await neonQuery(`
      CREATE TABLE IF NOT EXISTS misionspc.spc_game_players(
      player_id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      current_level INT DEFAULT 1,
      max_level INT DEFAULT 1,
      total_score INT DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE,
      level_scores JSONB DEFAULT '{}':: jsonb,
      attempts_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await neonQuery(`
      CREATE TABLE IF NOT EXISTS misionspc.spc_game_logs(
      id SERIAL PRIMARY KEY,
      player_id VARCHAR(50) REFERENCES misionspc.spc_game_players(player_id) ON DELETE CASCADE,
      level INT NOT NULL,
      passed BOOLEAN NOT NULL,
      score INT DEFAULT 0,
      detail JSONB DEFAULT '{}':: jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    try {
      await neonQuery('CREATE INDEX IF NOT EXISTS idx_spc_game_players_score ON misionspc.spc_game_players(total_score DESC)');
      await neonQuery('CREATE INDEX IF NOT EXISTS idx_spc_game_logs_player ON misionspc.spc_game_logs(player_id, level)');
    } catch (idxErr) { }

    console.log('✅ Tablas de Misión SPC verificadas y listas en Neon PostgreSQL.');
    return true;
  } catch (err) {
    console.warn('⚠️ Aviso en inicialización Neon:', err.message);
    return false;
  }
}

// 1. Health & Estado de Neon
app.get('/api/health', async (req, res) => {
  try {
    const r = await neonQuery('SELECT NOW() as now, current_database() as db');
    const countRes = await neonQuery('SELECT count(*) as count FROM misionspc.spc_game_players');
    res.json({
      ok: true,
      storage: 'Neon PostgreSQL (HTTPS)',
      db: r.rows[0].db,
      totalPlayers: parseInt(countRes.rows[0].count, 10),
      serverTime: r.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 2. Registro o Inicio de Sesión de Jugador por ID y Nombre
app.post('/api/player/login', async (req, res) => {
  try {
    const { playerId, name } = req.body;
    if (!playerId || !name) {
      return res.status(400).json({ ok: false, message: 'ID y Nombre son requeridos' });
    }

    const cleanId = String(playerId).trim();
    const cleanName = String(name).trim();

    // Buscar si ya existe
    const existing = await neonQuery('SELECT * FROM misionspc.spc_game_players WHERE player_id = $1', [cleanId]);

    if (existing.rows.length > 0) {
      const updateRes = await neonQuery(`
        UPDATE misionspc.spc_game_players
        SET name = $2, updated_at = NOW()
        WHERE player_id = $1
        RETURNING *
        `, [cleanId, cleanName]);
      return res.json({ ok: true, isNew: false, player: updateRes.rows[0] });
    }

    // Insertar nuevo jugador
    const insertRes = await neonQuery(`
      INSERT INTO misionspc.spc_game_players (player_id, name, current_level, max_level, total_score, completed, level_scores, attempts_count)
      VALUES ($1, $2, 1, 1, 0, false, '{}'::jsonb, 0)
      RETURNING *
    `, [cleanId, cleanName]);

      res.json({ ok: true, isNew: true, player: insertRes.rows[0] });
    } catch (err) {
      console.error('Error en /api/player/login:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

// 3. Obtener estado de un jugador
app.get('/api/player/:id', async (req, res) => {
  try {
    const cleanId = String(req.params.id).trim();
    const result = await neonQuery('SELECT * FROM misionspc.spc_game_players WHERE player_id = $1', [cleanId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Jugador no encontrado' });
    }
    res.json({ ok: true, player: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Registrar Nivel Superado (3/3 aciertos)
app.post('/api/player/level-complete', async (req, res) => {
  try {
    const { playerId, level, score, answersDetail } = req.body;
    if (!playerId || !level) {
      return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
    }

    const cleanId = String(playerId).trim();
    const lvl = parseInt(level, 10);
    const pts = parseInt(score, 10) || 100;

    const cur = await neonQuery('SELECT * FROM misionspc.spc_game_players WHERE player_id = $1', [cleanId]);
    if (cur.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Jugador no encontrado' });
    }

    const player = cur.rows[0];
    const scores = typeof player.level_scores === 'object' && player.level_scores !== null ? player.level_scores : JSON.parse(player.level_scores || '{}');
    scores[lvl] = pts;

    let totalScore = 0;
    for (const k in scores) {
      totalScore += (parseInt(scores[k], 10) || 0);
    }

    const nextLevel = Math.min(7, Math.max(player.current_level, lvl + 1));
    const maxLevel = Math.max(player.max_level || 1, nextLevel);
    const completed = (lvl >= 7) || player.completed;

    const updated = await neonQuery(`
      UPDATE misionspc.spc_game_players
      SET current_level = $2,
      max_level = $3,
      total_score = $4,
      completed = $5,
      level_scores = $6,
      updated_at = NOW()
      WHERE player_id = $1
      RETURNING *
      `, [cleanId, nextLevel, maxLevel, totalScore, completed, JSON.stringify(scores)]);

    // Registrar en auditoría de logs
    await neonQuery(`
      INSERT INTO misionspc.spc_game_logs (player_id, level, passed, score, detail, created_at)
      VALUES ($1, $2, true, $3, $4, NOW())
    `, [cleanId, lvl, pts, JSON.stringify(answersDetail || {})]);

    res.json({ ok: true, player: updated.rows[0] });
  } catch (err) {
    console.error('Error en /api/player/level-complete:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 5. Registrar Intento Fallido de un Nivel (Reinicio del Nivel)
app.post('/api/player/level-fail', async (req, res) => {
  try {
    const { playerId, level, answersDetail } = req.body;
    if (!playerId || !level) {
      return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
    }

    const cleanId = String(playerId).trim();
    const lvl = parseInt(level, 10);

    await neonQuery(`
      UPDATE misionspc.spc_game_players
      SET attempts_count = attempts_count + 1,
      updated_at = NOW()
      WHERE player_id = $1
      `, [cleanId]);

    await neonQuery(`
      INSERT INTO misionspc.spc_game_logs (player_id, level, passed, score, detail, created_at)
      VALUES ($1, $2, false, 0, $3, NOW())
    `, [cleanId, lvl, JSON.stringify(answersDetail || {})]);

    res.json({ ok: true, message: 'Intento registrado en Neon. Nivel reiniciado.' });
  } catch (err) {
    console.error('Error en /api/player/level-fail:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 6. Ranking de participantes
app.get('/api/ranking', async (req, res) => {
  try {
    const r = await neonQuery(`
      SELECT player_id, name, current_level, max_level, total_score, completed, attempts_count, updated_at
      FROM misionspc.spc_game_players
      ORDER BY total_score DESC, updated_at ASC
      LIMIT 25
      `);
    res.json({ ok: true, ranking: r.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Iniciar servidor inmediatamente (sin esperar a que la base de datos bloquee la apertura de puerto)
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Servidor de Juego SPC corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Base de datos: Neon PostgreSQL (Conexión HTTPS activa)`);
  console.log(`=======================================================`);
  // Verificar base de datos en segundo plano
  initDb();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está ocupado por otra ventana o proceso.`);
    console.error(`💡 Cierra la otra ventana de terminal o finaliza el proceso antes de reiniciar.`);
  } else {
    console.error('❌ Error al iniciar el servidor:', err.message);
  }
});
