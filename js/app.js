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
    return sesion && sesion.rol ? sesion.rol.toLowerCase() : 'cliente';
}

function mostrarPerro(perro, fotos) {
    perroActual = perro;

    nombrePerro.textContent = perro.name;
    personalidadPerro.textContent = perro.temperament || 'No especificado';
    vidaPerro.textContent = perro.life_span || 'No especificado';
    origenPerro.textContent = perro.origin || 'Desconocido';

    const fotoPrincipal = fotos.length > 0 ? fotos[0].url : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1';

    if (rol === 'admin' || rol === 'boss') {
        fotoSola.classList.add('ocultar');
        fotosVarias.classList.remove('ocultar');
        fotosVarias.innerHTML = '';

        const listaFotos = fotos.length > 0 ? fotos : [{ url: fotoPrincipal }];
        listaFotos.forEach(item => {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = perro.name;
            fotosVarias.appendChild(img);
        });
    } else {
        fotosVarias.classList.add('ocultar');
        fotoSola.classList.remove('ocultar');
        imgPerro.src = fotoPrincipal;
    }

    errorPerro.classList.add('ocultar');
    resultado.classList.remove('ocultar');

    if ((rol === 'admin' || rol === 'boss') && !cajaPeso.classList.contains('ocultar')) {
        verPeso();
    }
}

function buscarRaza() {
    const nombre = textoBuscar.value.trim();
    if (nombre === '') return;

    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${nombre}`, {
        headers: { 'x-api-key': llaveApi }
    })
    .then(res => res.json())
    .then(lista => {
        if (lista.length === 0) {
            resultado.classList.add('ocultar');
            errorPerro.classList.remove('ocultar');
            return;
        }

        const perro = lista[0];
        const cantidadFotos = (rol === 'admin' || rol === 'boss') ? 4 : 1;

        fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}&limit=${cantidadFotos}`, {
            headers: { 'x-api-key': llaveApi }
        })
        .then(res => res.json())
        .then(fotos => mostrarPerro(perro, fotos));
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
            const perro = datos[0].breeds[0];
            textoBuscar.value = '';

            if (rol === 'admin' || rol === 'boss') {
                fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}&limit=4`, {
                    headers: { 'x-api-key': llaveApi }
                })
                .then(res => res.json())
                .then(fotos => mostrarPerro(perro, fotos));
            } else {
                mostrarPerro(perro, [{ url: datos[0].url }]);
            }
        }
    })
    .catch(err => console.log(err));
}

function verPeso() {
    if (!perroActual) {
        alert('Primero busca una raza o da clic en Aleatorio');
        return;
    }

    const dibujarTabla = (pesoTexto) => {
        const limpio = (pesoTexto || '').trim();
        const nums = limpio.match(/\d+(\.\d+)?/g);

        if (!nums) {
            cuerpoTablaPeso.innerHTML = `
                <tr>
                    <td>${perroActual.name}</td>
                    <td>No disponible</td>
                    <td>-</td>
                </tr>
            `;
            if (rol === 'boss') {
                consejo.textContent = 'Consejo: consulta con el veterinario el peso ideal de esta raza.';
                consejo.classList.remove('ocultar');
            }
            cajaPeso.classList.remove('ocultar');
            return;
        }

        const maxPeso = parseFloat(nums[nums.length - 1]);
        let tamano = 'Mediano';
        let textoConsejo = 'Paseo diario y porciones medidas para mantener su peso.';

        if (maxPeso <= 10) {
            tamano = 'Pequeño';
            textoConsejo = 'Croquetas pequeñas y cuidar sus dientes y saltos.';
        } else if (maxPeso > 25) {
            tamano = 'Grande';
            textoConsejo = 'Cuidar articulaciones y evitar correr justo después de comer.';
        }

        cuerpoTablaPeso.innerHTML = `
            <tr>
                <td>${perroActual.name}</td>
                <td>${limpio} kg</td>
                <td>${tamano}</td>
            </tr>
        `;

        if (rol === 'boss') {
            consejo.textContent = 'Consejo: ' + textoConsejo;
            consejo.classList.remove('ocultar');
        } else {
            consejo.classList.add('ocultar');
        }

        cajaPeso.classList.remove('ocultar');
    };

    if (perroActual.weight?.metric) {
        dibujarTabla(perroActual.weight.metric);
    } else {
        fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': llaveApi }
        })
        .then(res => res.json())
        .then(razas => {
            const raza = razas.find(r => r.id === perroActual.id || r.name === perroActual.name);
            dibujarTabla(raza?.weight?.metric || '');
        })
        .catch(() => dibujarTabla(''));
    }
}

function configurarRol() {
    rol = leerRol();
    const titulo = document.getElementById('titulo');

    btnAleatorio.classList.add('ocultar');
    cajaBotonPeso.classList.add('ocultar');
    cajaPeso.classList.add('ocultar');
    consejo.classList.add('ocultar');

    if (rol === 'admin') {
        titulo.textContent = 'Perritos';
        btnAleatorio.classList.remove('ocultar');
        cajaBotonPeso.classList.remove('ocultar');
    } else if (rol === 'boss') {
        titulo.textContent = 'Perritos';
        btnAleatorio.classList.remove('ocultar');
        cajaBotonPeso.classList.remove('ocultar');
        btnPeso.textContent = 'Ver tabla de peso y consejo';
    } else {
        titulo.textContent = 'Perritos';
    }
}

btnBuscar.addEventListener('click', buscarRaza);
btnAleatorio.addEventListener('click', perroAleatorio);
btnPeso.addEventListener('click', verPeso);
textoBuscar.addEventListener('keypress', e => {
    if (e.key === 'Enter') buscarRaza();
});

configurarRol();