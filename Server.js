const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Facebook12690@', // tu contraseña
  database: 'questioniq_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Ruta para obtener respuesta según la pregunta enviada
app.post('/preguntar', (req, res) => {
  const { pregunta } = req.body;
  const sql = 'SELECT respuestas FROM respuestas WHERE preguntas = ? LIMIT 1';

  db.query(sql, [pregunta], (err, results) => {
    if (err) {
  console.error('🔴 ERROR DETALLADO:', err.sqlMessage || err.message);
  return res.status(500).json({ respuesta: 'Error en la base de datos' });
}


    if (results.length > 0) {
      res.json({ respuesta: results[0].respuestas });
    } else {
      res.json({ respuesta: 'No encontré una respuesta para esa pregunta.' });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
