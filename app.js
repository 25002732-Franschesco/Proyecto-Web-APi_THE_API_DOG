const apiKey = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eqD46STpme31g';

const cajaTexto = document.getElementById('input-search');
const botonBuscar = document.getElementById('btn-search');
const botonAleatorio = document.getElementById('btn-random');
const tarjetaResultado = document.getElementById('result-container');
const avisoError = document.getElementById('error-msg');

const imagenPerro = document.getElementById('dog-img');
const textoNombre = document.getElementById('dog-name');
const textoCaracter = document.getElementById('dog-temperament');
const textoVida = document.getElementById('dog-life');
const textoOrigen = document.getElementById('dog-origin');

async function buscarPerro() {
    const texto = cajaTexto.value.trim();

    if (texto === '') {
        alert('Escribe una raza por favor');
        return;
    }

    try {
        const respuesta = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${texto}`, {
            headers: { 'x-api-key': apiKey }
        });
        const lista = await respuesta.json();

        if (lista.length === 0) {
            tarjetaResultado.classList.add('hidden');
            avisoError.classList.remove('hidden');
            return;
        }

        mostrarDatos(lista[0]);

    } catch (error) {
        console.log("Error:", error);
    }
}

async function buscarAleatorio() {
    try {
        const respuesta = await fetch(`https://api.thedogapi.com/v1/images/search?has_breeds=1`, {
            headers: { 'x-api-key': apiKey }
        });
        const datos = await respuesta.json();

        if (datos.length > 0 && datos[0].breeds.length > 0) {
            const perroAleatorio = datos[0].breeds[0];
            imagenPerro.src = datos[0].url;
            mostrarDatos(perroAleatorio);
            cajaTexto.value = '';
        }
    } catch (error) {
        console.log("Error al cargar aleatorio:", error);
    }
}

async function mostrarDatos(perro) {
    textoNombre.textContent = perro.name;
    textoCaracter.textContent = perro.temperament || 'No especificado';
    textoVida.textContent = perro.life_span || 'No especificado';
    textoOrigen.textContent = perro.origin || 'Desconocido';

    if (perro.id && !imagenPerro.src.includes(perro.id)) {
        const respuestaFoto = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}`, {
            headers: { 'x-api-key': apiKey }
        });
        const datosFoto = await respuestaFoto.json();

        if (datosFoto.length > 0) {
            imagenPerro.src = datosFoto[0].url;
        }
    }

    avisoError.classList.add('hidden');
    tarjetaResultado.classList.remove('hidden');
}

botonBuscar.addEventListener('click', buscarPerro);
botonAleatorio.addEventListener('click', buscarAleatorio);
cajaTexto.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPerro();
    }
});