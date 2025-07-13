const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Ruta para obtener respuesta según la pregunta enviada
app.get("/", (req, res) => {
  res.send("¡QuestionIQ está en línea! ✅");

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
