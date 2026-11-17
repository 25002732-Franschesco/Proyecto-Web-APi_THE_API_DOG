const apiKey = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eQd46StPme3lg';

const buscador = document.getElementById('input-search');
const boton = document.getElementById('btn-search');
const resultado = document.getElementById('result-container');
const mensajeError = document.getElementById('error-msg');

const foto = document.getElementById('dog-img');
const nombre = document.getElementById('dog-name');
const temperamento = document.getElementById('dog-temperament');
const vida = document.getElementById('dog-life');
const origen = document.getElementById('dog-origin');

async function buscar() {
    const texto = buscador.value.trim();
    
    if (texto === '') {
        alert('Escribe una raza por favor');
        return;
    }

    try {
        const respuesta = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${texto}`, {
            headers: { 'x-api-key': apiKey }
        });
        const datos = await respuesta.json();

        if (datos.length === 0) {
            resultado.classList.add('hidden');
            mensajeError.classList.remove('hidden');
            return;
        }

        const perro = datos[0];
        
        nombre.textContent = perro.name;
        temperamento.textContent = perro.temperament || 'No especificado';
        vida.textContent = perro.life_span || 'No especificado';
        origen.textContent = perro.origin || 'Desconocido';

        traerFoto(perro.id);

        mensajeError.classList.add('hidden');
        resultado.classList.remove('hidden');

    } catch (error) {
        console.log("Hubo un error:", error);
    }
}

async function traerFoto(id) {
    try {
        const respuesta = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${id}`, {
            headers: { 'x-api-key': apiKey }
        });
        const lista = await respuesta.json();

        if (lista.length > 0) {
            foto.src = lista[0].url;
        }
    } catch (error) {
        console.log("No se pudo cargar la foto:", error);
    }
}

boton.addEventListener('click', buscar);
buscador.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscar();
    }
});