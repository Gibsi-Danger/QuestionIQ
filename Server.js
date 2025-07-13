const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a la base de datos remota (usando .env variables en Render)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306 // ✅ Requerido para Render + freesqldatabase
});

// Conexión inicial
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('✅ Conectado a la base de datos MySQL remota');
  }
});

// Ruta base (verificación)
app.get('/', (req, res) => {
  res.send('¡QuestionIQ está en línea! ✅');
});

// Ruta para obtener respuesta automática desde la base de datos
app.post('/preguntar', (req, res) => {
  const { pregunta } = req.body;

  const sql = 'SELECT respuestas FROM respuestas WHERE preguntas = ? LIMIT 1';

  db.query(sql, [pregunta], (err, results) => {
    if (err) {
      console.error('❌ Error al consultar la base de datos:', err);
      return res.status(500).json({ respuesta: 'Error en la base de datos' });
    }

    if (results.length > 0) {
      res.json({ respuesta: results[0].respuestas });
    } else {
      res.json({ respuesta: 'No encontré una respuesta para esa pregunta.' });
    }
  });
});

// Escuchar en puerto asignado (Render usará uno propio o 3000 localmente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
