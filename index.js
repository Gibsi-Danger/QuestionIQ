const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // o el usuario que uses
  password: "",        // tu contraseña si tiene
  database: "questioniq"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL");
});

// Ruta para buscar respuesta
app.post("/preguntar", (req, res) => {
  const pregunta = req.body.pregunta;
  db.query(
    "SELECT respuesta FROM respuestas WHERE pregunta = ?",
    [pregunta],
    (err, results) => {
      if (err) return res.status(500).json({ respuesta: "Error interno" });
      if (results.length > 0) {
        res.json({ respuesta: results[0].respuesta });
      } else {
        res.json({ respuesta: "❌ No se encontró respuesta para esa pregunta." });
      }
    }
  );
});

app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
