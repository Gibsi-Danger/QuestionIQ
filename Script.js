// Script.js actualizado con conexión a MySQL desde backend

const contenedor = document.getElementById("contenedorPreguntas");
const form = document.getElementById("preguntaForm");
const campoPregunta = document.getElementById("preguntaTexto");
const URL_API = "http://localhost:3000/preguntar";

// Función para obtener respuesta desde la base de datos
async function obtenerRespuestaDesdeBD(pregunta) {
  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta })
  });
  const data = await res.json();
  return data.respuesta;
}

// Función para mostrar preguntas (ya lo tienes bien hecho)
function mostrarPreguntas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  contenedor.innerHTML = "";
  preguntas.forEach(p => {
    const caja = document.createElement("div");
    caja.classList.add("caja-pregunta");
    caja.innerHTML = `
      <strong>📅 ${p.fecha}</strong><br>
      ${p.texto}
    `;
    contenedor.appendChild(caja);
  });
}

// Guardar pregunta y llamar al backend
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const texto = campoPregunta.value.trim();
  if (texto === "") return;

  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const nuevaPregunta = {
    texto,
    fecha: new Date().toLocaleDateString()
  };
  preguntas.unshift(nuevaPregunta);
  localStorage.setItem("preguntas", JSON.stringify(preguntas));
  campoPregunta.value = "";

  mostrarPreguntas();

  // ✅ Llamar a la base de datos para obtener respuesta automática
  const respuesta = await obtenerRespuestaDesdeBD(texto);
  const caja = document.createElement("div");
  caja.classList.add("respuesta-automatica");
  caja.innerHTML = `
    <p><strong>🤖 Respuesta automática:</strong><br>${respuesta}</p>
  `;
  contenedor.appendChild(caja);
});

// Mostrar preguntas al cargar la página
mostrarPreguntas();
