const llaveApi = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eQd46StPme3lg';

const textoBuscar = document.getElementById('textoBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const btnAleatorio = document.getElementById('btnAleatorio');
const cajaBotonPeso = document.getElementById('cajaBotonPeso');
const btnPeso = document.getElementById('btnPeso');

const resultado = document.getElementById('resultado');
const fotoSola = document.getElementById('fotoSola');
const fotosVarias = document.getElementById('fotosVarias');
const errorPerro = document.getElementById('errorPerro');

const imgPerro = document.getElementById('imgPerro');
const nombrePerro = document.getElementById('nombrePerro');
const personalidadPerro = document.getElementById('personalidadPerro');
const vidaPerro = document.getElementById('vidaPerro');
const origenPerro = document.getElementById('origenPerro');

const cajaPeso = document.getElementById('cajaPeso');
const cuerpoTablaPeso = document.getElementById('cuerpoTablaPeso');
const consejo = document.getElementById('consejo');

let rol = 'cliente';
let perroActual = null;

function leerRol() {
    const sesion = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    if (sesion && sesion.rol) {
        return sesion.rol.toLowerCase();
    }
    return 'cliente';
}

function mostrarPerro(perro, fotos) {
    perroActual = perro;

    nombrePerro.textContent = perro.name;
    personalidadPerro.textContent = perro.temperament || 'No especificado';
    vidaPerro.textContent = perro.life_span || 'No especificado';
    origenPerro.textContent = perro.origin || 'Desconocido';

    const foto1 = fotos.length > 0 ? fotos[0].url : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1';

    if (rol === 'admin' || rol === 'boss') {
        fotoSola.classList.add('ocultar');
        fotosVarias.classList.remove('ocultar');
        fotosVarias.innerHTML = '';

        for (let i = 0; i < fotos.length; i++) {
            const img = document.createElement('img');
            img.src = fotos[i].url;
            fotosVarias.appendChild(img);
        }
    } else {
        fotosVarias.classList.add('ocultar');
        fotoSola.classList.remove('ocultar');
        imgPerro.src = foto1;
    }

    errorPerro.classList.add('ocultar');
    resultado.classList.remove('ocultar');

    if ((rol === 'admin' || rol === 'boss') && !cajaPeso.classList.contains('ocultar')) {
        verPeso();
    }
}

function cargarFotosYMostrar(perro) {
    let limite = 1;
    if (rol === 'admin' || rol === 'boss') {
        limite = 4;
    }

    fetch('https://api.thedogapi.com/v1/images/search?breed_ids=' + perro.id + '&limit=' + limite, {
        headers: { 'x-api-key': llaveApi }
    })
    .then(res => res.json())
    .then(fotos => {
        mostrarPerro(perro, fotos);
    })
    .catch(err => console.log(err));
}

function buscarRaza() {
    const nombre = textoBuscar.value.trim();
    if (nombre === '') return;

    fetch('https://api.thedogapi.com/v1/breeds/search?q=' + nombre, {
        headers: { 'x-api-key': llaveApi }
    })
    .then(res => res.json())
    .then(lista => {
        if (lista.length === 0) {
            resultado.classList.add('ocultar');
            errorPerro.classList.remove('ocultar');
            return;
        }
        cargarFotosYMostrar(lista[0]);
    })
    .catch(err => console.log(err));
}

function perroAleatorio() {
    fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1', {
        headers: { 'x-api-key': llaveApi }
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.length > 0 && datos[0].breeds.length > 0) {
            textoBuscar.value = '';
            const perro = datos[0].breeds[0];

            if (rol === 'admin' || rol === 'boss') {
                cargarFotosYMostrar(perro);
            } else {
                mostrarPerro(perro, [{ url: datos[0].url }]);
            }
        }
    })
    .catch(err => console.log(err));
}

function pintarPeso(pesoTexto) {
    const texto = (pesoTexto || '').trim();
    const partes = texto.split('-');
    const ultimo = parseFloat(partes[partes.length - 1]);

    if (isNaN(ultimo)) {
        cuerpoTablaPeso.innerHTML = '<tr><td>' + perroActual.name + '</td><td>No disponible</td><td>-</td></tr>';
        if (rol === 'boss') {
            consejo.textContent = 'Consejo: consulta con el veterinario el peso ideal.';
            consejo.classList.remove('ocultar');
        }
        cajaPeso.classList.remove('ocultar');
        return;
    }

    let tamano = 'Mediano';
    let textoConsejo = 'Paseo diario y porciones medidas.';

    if (ultimo <= 10) {
        tamano = 'Pequeño';
        textoConsejo = 'Croquetas pequeñas y cuidar dientes y saltos.';
    } else if (ultimo > 25) {
        tamano = 'Grande';
        textoConsejo = 'Cuidar articulaciones y no correr tras comer.';
    }

    cuerpoTablaPeso.innerHTML = '<tr><td>' + perroActual.name + '</td><td>' + texto + ' kg</td><td>' + tamano + '</td></tr>';

    if (rol === 'boss') {
        consejo.textContent = 'Consejo: ' + textoConsejo;
        consejo.classList.remove('ocultar');
    } else {
        consejo.classList.add('ocultar');
    }

    cajaPeso.classList.remove('ocultar');
}

function verPeso() {
    if (!perroActual) {
        alert('Primero busca una raza o da clic en Aleatorio');
        return;
    }

    if (perroActual.weight && perroActual.weight.metric) {
        pintarPeso(perroActual.weight.metric);
    } else {
        fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': llaveApi }
        })
        .then(res => res.json())
        .then(razas => {
            const encontrada = razas.find(r => r.id === perroActual.id || r.name === perroActual.name);
            pintarPeso(encontrada && encontrada.weight ? encontrada.weight.metric : '');
        })
        .catch(() => pintarPeso(''));
    }
}

function configurarRol() {
    rol = leerRol();

    btnAleatorio.classList.add('ocultar');
    cajaBotonPeso.classList.add('ocultar');
    cajaPeso.classList.add('ocultar');
    consejo.classList.add('ocultar');

    if (rol === 'admin') {
        btnAleatorio.classList.remove('ocultar');
        cajaBotonPeso.classList.remove('ocultar');
    } else if (rol === 'boss') {
        btnAleatorio.classList.remove('ocultar');
        cajaBotonPeso.classList.remove('ocultar');
        btnPeso.textContent = 'Ver tabla de peso y consejo';
    }
}

btnBuscar.onclick = buscarRaza;
btnAleatorio.onclick = perroAleatorio;
btnPeso.onclick = verPeso;
textoBuscar.onkeypress = function (e) {
    if (e.key === 'Enter') buscarRaza();
};

configurarRol();