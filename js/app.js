const apiKey = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eQd46StPme3lg';

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

function mostrarDatos(perro, urlImagen) {
    textoNombre.textContent = perro.name;
    textoCaracter.textContent = perro.temperament || 'No especificado';
    textoVida.textContent = perro.life_span || 'No especificado';
    textoOrigen.textContent = perro.origin || 'Desconocido';
    imagenPerro.src = urlImagen || "https://images.unsplash.com/photo-1543466835-00a7907e9de1";

    avisoError.classList.add('hidden');
    tarjetaResultado.classList.remove('hidden');
}

function buscarPerro() {
    const texto = cajaTexto.value.trim();
    if (texto === '') return;

    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${texto}`, {
        headers: { 'x-api-key': apiKey }
    })
    .then(respuesta => respuesta.json())
    .then(lista => {
        if (lista.length === 0) {
            tarjetaResultado.classList.add('hidden');
            avisoError.classList.remove('hidden');
            return;
        }

        const perro = lista[0];
        let urlFoto = perro.image?.url;

        if (urlFoto) {
            mostrarDatos(perro, urlFoto);
        } else {
            fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}`, {
                headers: { 'x-api-key': apiKey }
            })
            .then(respImg => respImg.json())
            .then(datosImg => {
                if (datosImg.length > 0) urlFoto = datosImg[0].url;
                mostrarDatos(perro, urlFoto);
            })
            .catch(error => console.log("Error:", error));
        }
    })
    .catch(error => console.log("Error:", error));
}

function buscarAleatorio() {
    fetch(`https://api.thedogapi.com/v1/images/search?has_breeds=1`, {
        headers: { 'x-api-key': apiKey }
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.length > 0 && datos[0].breeds.length > 0) {
            const item = datos[0];
            const perro = item.breeds[0];
            cajaTexto.value = '';
            mostrarDatos(perro, item.url);
        }
    })
    .catch(error => console.log("Error:", error));
}

botonBuscar.addEventListener('click', buscarPerro);
botonAleatorio.addEventListener('click', buscarAleatorio);
cajaTexto.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPerro();
});