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
    if (texto === '') return;

    try {
        console.log("Buscando en la API...");
        const respuesta = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${texto}`, {
            headers: { 'x-api-key': apiKey }
        });
        
        console.log("Código de estado de la API:", respuesta.status); // <--- Esto nos dirá si la rechaza (403, 401, etc.)
        const lista = await respuesta.json();
        console.log("Datos recibidos:", lista);

        if (lista.length === 0) {
            tarjetaResultado.classList.add('hidden');
            avisoError.classList.remove('hidden');
            return;
        }

        const perro = lista[0];
        textoNombre.textContent = perro.name;
        textoCaracter.textContent = perro.temperament || 'No especificado';
        textoVida.textContent = perro.life_span || 'No especificado';
        textoOrigen.textContent = perro.origin || 'Desconocido';
        
        imagenPerro.src = perro.image?.url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1";

        avisoError.classList.add('hidden');
        tarjetaResultado.classList.remove('hidden');

    } catch (error) {
        console.log("Error crítico atrapado:", error);
    }
}

botonBuscar.addEventListener('click', buscarPerro);
cajaTexto.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPerro();
});