const formulario = document.getElementById("gameForm");
const listaJuegos = document.getElementById("listaJuegos");

const nombre = document.getElementById("nombre");
const genero = document.getElementById("genero");
const plataforma = document.getElementById("plataforma");
const fecha = document.getElementById("fecha");
const prioridad = document.getElementById("prioridad");

let juegos = JSON.parse(localStorage.getItem("juegos")) || [];
let editando = null;

// Eventos requeridos por la rúbrica
formulario.addEventListener("submit", guardarJuego);
nombre.addEventListener("input", validarNombre);
fecha.addEventListener("change", validarFecha);

mostrarJuegos();

function guardarJuego(e) {
    e.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const juego = {
        id: editando || Date.now(),
        nombre: nombre.value.trim(),
        genero: genero.value,
        plataforma: plataforma.value,
        fecha: fecha.value,
        prioridad: prioridad.value
    };

    if (editando) {
        juegos = juegos.map(j => j.id === editando ? juego : j);
        editando = null;
        document.getElementById("btnGuardar").textContent = "Guardar";
    } else {
        juegos.push(juego);
    }

    guardarLocalStorage();
    mostrarJuegos();
    formulario.reset();
}

function validarFormulario() {

    let valido = true;

    if (!validarNombre()) valido = false;

    if (genero.value === "") {
        document.getElementById("errorGenero").textContent =
            "Debe seleccionar un género";
        valido = false;
    } else {
        document.getElementById("errorGenero").textContent = "";
    }

    if (plataforma.value === "") {
        document.getElementById("errorPlataforma").textContent =
            "Debe seleccionar una plataforma";
        valido = false;
    } else {
        document.getElementById("errorPlataforma").textContent = "";
    }

    if (!validarFecha()) valido = false;

    if (prioridad.value === "") {
        document.getElementById("errorPrioridad").textContent =
            "Debe seleccionar una prioridad";
        valido = false;
    } else {
        document.getElementById("errorPrioridad").textContent = "";
    }

    return valido;
}

function validarNombre() {

    const valor = nombre.value.trim();

    if (valor === "") {
        errorNombre.textContent = "Campo obligatorio";
        nombre.className = "invalido";
        return false;
    }

    if (valor.length < 3) {
        errorNombre.textContent =
            "Debe tener al menos 3 caracteres";
        nombre.className = "invalido";
        return false;
    }

    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!regex.test(valor)) {
        errorNombre.textContent =
            "Solo letras y números";
        nombre.className = "invalido";
        return false;
    }

    const repetido = juegos.some(j =>
        j.nombre.toLowerCase() === valor.toLowerCase() &&
        j.id !== editando
    );

    if (repetido) {
        errorNombre.textContent =
            "Este videojuego ya existe";
        nombre.className = "invalido";
        return false;
    }

    errorNombre.textContent = "";
    nombre.className = "valido";

    return true;
}

function validarFecha() {

    const hoy = new Date().toISOString().split("T")[0];

    if (fecha.value === "") {
        errorFecha.textContent = "Seleccione una fecha";
        return false;
    }

    if (fecha.value < hoy) {
        errorFecha.textContent =
            "La fecha no puede ser anterior a hoy";
        return false;
    }

    errorFecha.textContent = "";
    return true;
}

function mostrarJuegos() {

    listaJuegos.innerHTML = "";

    if (juegos.length === 0) {

        const mensaje = document.createElement("p");
        mensaje.textContent =
            "No hay videojuegos registrados.";

        listaJuegos.appendChild(mensaje);
        return;
    }

    juegos.forEach(juego => {

        const card = document.createElement("div");
        card.classList.add("card");

        const titulo = document.createElement("h3");
        titulo.textContent = juego.nombre;

        const datos = document.createElement("div");
        datos.innerHTML = `
            <p><strong>Género:</strong> ${juego.genero}</p>
            <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
            <p><strong>Fecha:</strong> ${juego.fecha}</p>
            <p><strong>Prioridad:</strong> ${juego.prioridad}</p>
        `;

        const botones = document.createElement("div");
        botones.classList.add("card-buttons");

        const btnEditar =
            document.createElement("button");

        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-editar");

        btnEditar.addEventListener("click", () => {
            editarJuego(juego.id);
        });

        const btnEliminar =
            document.createElement("button");

        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", () => {
            eliminarJuego(juego.id, card);
        });

        botones.appendChild(btnEditar);
        botones.appendChild(btnEliminar);

        card.appendChild(titulo);
        card.appendChild(datos);
        card.appendChild(botones);

        listaJuegos.appendChild(card);
    });
}

function editarJuego(id) {

    const juego =
        juegos.find(j => j.id === id);

    nombre.value = juego.nombre;
    genero.value = juego.genero;
    plataforma.value = juego.plataforma;
    fecha.value = juego.fecha;
    prioridad.value = juego.prioridad;

    editando = id;

    document.getElementById("btnGuardar")
        .textContent = "Actualizar";
}

function eliminarJuego(id, card) {

    juegos = juegos.filter(
        j => j.id !== id
    );

    card.remove();

    guardarLocalStorage();
    mostrarJuegos();
}

function guardarLocalStorage() {

    localStorage.setItem(
        "juegos",
        JSON.stringify(juegos)
    );
}

function validarPrioridadFecha() {

    if (prioridad.value === "Alta" && fecha.value !== "") {
        const fechaSeleccionada = new Date(fecha.value);
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + 30);

        if (fechaSeleccionada > limite) {
            document.getElementById("errorPrioridad").textContent =
                "Prioridad Alta requiere una fecha dentro de 30 días";
            return false;
        }
    }

    return true;
}
