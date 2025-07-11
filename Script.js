// Elementos del DOM
const form = document.getElementById("preguntaForm");
const input = document.getElementById("preguntaTexto");
const contenedor = document.getElementById("contenedorPreguntas");

// Obtener preguntas guardadas o empezar con array vacío
let preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];

function mostrarPreguntas() {
  contenedor.innerHTML = ""; // Limpia el contenedor

  preguntas.slice().reverse().forEach((pregunta, index) => {
    const caja = document.createElement("div");
    caja.classList.add("caja-pregunta");
    caja.innerHTML = `
      <p><strong>📅 ${pregunta.fecha}</strong></p>
      <p>${pregunta.texto}</p>
    `;
    contenedor.appendChild(caja);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que recargue la página

  const texto = input.value.trim();
  if (texto === "") return;

  const fecha = new Date().toLocaleDateString("es-CO");

  const nuevaPregunta = {
    texto,
    fecha
  };

  preguntas.push(nuevaPregunta);
  localStorage.setItem("preguntas", JSON.stringify(preguntas));

  input.value = ""; // Limpia el campo
  mostrarPreguntas();
});

// Mostrar automáticamente al cargar
mostrarPreguntas();

// Evita que la pantalla vuelva a aparecer si ya entró
window.addEventListener("load", () => {
  const bienvenida = document.getElementById("pantallaBienvenida");
  setTimeout(() => {
    bienvenida.style.display = "none";
  }, 3000); // igual a la duración total de la animación
});
