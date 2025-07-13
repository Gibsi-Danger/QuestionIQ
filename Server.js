const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a la base de datos remota usando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306   // ✅ ¡AGREGA ESTO!
});



// Verificar la conexión al iniciar el servidor
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
    process.exit(1); // Detiene la app si no se conecta
  } else {
    console.log('✅ Conectado a la base de datos MySQL remota');
  }
});

// Ruta base para saber si está funcionando
app.get("/", (req, res) => {
  res.send("¡QuestionIQ está en línea! ✅");
});

// Ruta para obtener respuesta automática desde la base de datos
app.post("/preguntar", (req, res) => {
  const { pregunta } = req.body;

  const sql = 'SELECT respuestas FROM respuestas WHERE preguntas = ? LIMIT 1';

  db.query(sql, [pregunta], (err, results) => {
    if (err) {
      console.error("❌ Error al consultar:", err);
      return res.status(500).json({ respuesta: "Error en la base de datos" });
    }

    if (results.length > 0) {
      res.json({ respuesta: results[0].respuestas });
    } else {
      res.json({ respuesta: "No encontré una respuesta para esa pregunta." });
    }
  });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
