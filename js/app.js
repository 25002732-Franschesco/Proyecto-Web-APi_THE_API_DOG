const apiKey = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eQd46StPme3lg';

const cajaTexto = document.getElementById('input-search');
const botonBuscar = document.getElementById('btn-search');
const botonAleatorio = document.getElementById('btn-random');
const zonaTablaBtn = document.getElementById('zona-tabla-btn');
const botonTabla = document.getElementById('btn-tabla');

const tarjetaResultado = document.getElementById('result-container');
const singleImgBox = document.getElementById('single-img-box');
const multiImgBox = document.getElementById('multi-img-box');
const avisoError = document.getElementById('error-msg');

const imagenPerro = document.getElementById('dog-img');
const textoNombre = document.getElementById('dog-name');
const textoCaracter = document.getElementById('dog-temperament');
const textoVida = document.getElementById('dog-life');
const textoOrigen = document.getElementById('dog-origin');

const panelTabla = document.getElementById('panel-tabla');
const tbodyPeso = document.getElementById('tbody-peso');
const consejoSalud = document.getElementById('consejo-salud');

let rolActual = 'cliente';
let perroActual = null;

function obtenerRol() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    return sesion && sesion.rol ? sesion.rol.toLowerCase() : 'cliente';
}

function mostrarDatos(perro, listaImagenes) {
    perroActual = perro;

    textoNombre.textContent = perro.name;
    textoCaracter.textContent = perro.temperament || 'No especificado';
    textoVida.textContent = perro.life_span || 'No especificado';
    textoOrigen.textContent = perro.origin || 'Desconocido';

    const fotoPrincipal = listaImagenes.length > 0
        ? listaImagenes[0].url
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1';

    if (rolActual === 'admin' || rolActual === 'boss') {
        singleImgBox.classList.add('hidden');
        multiImgBox.classList.remove('hidden');
        multiImgBox.innerHTML = '';

        const fotos = listaImagenes.length > 0 ? listaImagenes : [{ url: fotoPrincipal }];
        fotos.forEach(item => {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = perro.name;
            multiImgBox.appendChild(img);
        });
    } else {
        multiImgBox.classList.add('hidden');
        singleImgBox.classList.remove('hidden');
        imagenPerro.src = fotoPrincipal;
    }

    avisoError.classList.add('hidden');
    tarjetaResultado.classList.remove('hidden');

    if ((rolActual === 'admin' || rolActual === 'boss') && !panelTabla.classList.contains('hidden')) {
        mostrarTablaPeso();
    }
}

function buscarPerro() {
    const texto = cajaTexto.value.trim();
    if (texto === '') return;

    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${texto}`, {
        headers: { 'x-api-key': apiKey }
    })
    .then(res => res.json())
    .then(lista => {
        if (lista.length === 0) {
            tarjetaResultado.classList.add('hidden');
            avisoError.classList.remove('hidden');
            return;
        }

        const perro = lista[0];
        const limiteFotos = (rolActual === 'admin' || rolActual === 'boss') ? 4 : 1;

        fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}&limit=${limiteFotos}`, {
            headers: { 'x-api-key': apiKey }
        })
        .then(r => r.json())
        .then(imgs => {
            mostrarDatos(perro, imgs);
        });
    })
    .catch(err => console.log('Error:', err));
}

function buscarAleatorio() {
    fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1', {
        headers: { 'x-api-key': apiKey }
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.length > 0 && datos[0].breeds.length > 0) {
            const perro = datos[0].breeds[0];
            cajaTexto.value = '';

            if (rolActual === 'admin' || rolActual === 'boss') {
                fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${perro.id}&limit=4`, {
                    headers: { 'x-api-key': apiKey }
                })
                .then(r => r.json())
                .then(imgs => mostrarDatos(perro, imgs));
            } else {
                mostrarDatos(perro, [{ url: datos[0].url }]);
            }
        }
    })
    .catch(err => console.log('Error:', err));
}

function mostrarTablaPeso() {
    if (!perroActual) {
        alert('Primero busca una raza o presiona Aleatorio');
        return;
    }

    const pintar = (pesoStr) => {
        const limpio = (pesoStr || '').trim();
        const numeros = limpio.match(/\d+(\.\d+)?/g);

        if (!numeros || numeros.length === 0) {
            tbodyPeso.innerHTML = `
                <tr>
                    <td>${perroActual.name}</td>
                    <td>No disponible</td>
                    <td>Desconocido</td>
                </tr>
            `;
            if (rolActual === 'boss') {
                consejoSalud.innerHTML = `<strong>Consejo de salud:</strong> Consulta el peso ideal de esta raza con un veterinario antes de ajustar su dieta y ejercicio.`;
                consejoSalud.classList.remove('hidden');
            } else {
                consejoSalud.classList.add('hidden');
            }
            panelTabla.classList.remove('hidden');
            return;
        }

        const pesoMax = parseFloat(numeros[numeros.length - 1]);
        let tamano = 'Mediano';
        let consejo = 'Paseos diarios de 40 a 60 minutos y control de porciones para cuidar su peso.';

        if (pesoMax <= 10) {
            tamano = 'Pequeño';
            consejo = 'Croquetas de grano pequeño, higiene dental frecuente y cuidado con saltos altos.';
        } else if (pesoMax > 25) {
            tamano = 'Grande';
            consejo = 'Cuida sus articulaciones evitando ejercicio intenso justo después de comer y revisa su cadera.';
        }

        tbodyPeso.innerHTML = `
            <tr>
                <td>${perroActual.name}</td>
                <td>${limpio} kg</td>
                <td>${tamano}</td>
            </tr>
        `;

        if (rolActual === 'boss') {
            consejoSalud.innerHTML = `<strong>Consejo de salud:</strong> ${consejo}`;
            consejoSalud.classList.remove('hidden');
        } else {
            consejoSalud.classList.add('hidden');
        }

        panelTabla.classList.remove('hidden');
    };

    if (perroActual.weight?.metric) {
        pintar(perroActual.weight.metric);
    } else {
        fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': apiKey }
        })
        .then(res => res.json())
        .then(razas => {
            const encontrada = razas.find(r => r.id === perroActual.id || r.name === perroActual.name);
            pintar(encontrada?.weight?.metric || '');
        })
        .catch(() => pintar(''));
    }
}

function iniciarVistaPorRol() {
    rolActual = obtenerRol();
    const titulo = document.getElementById('titulo-rol');

    botonAleatorio.classList.add('hidden');
    zonaTablaBtn.classList.add('hidden');
    panelTabla.classList.add('hidden');
    consejoSalud.classList.add('hidden');

    if (rolActual === 'admin') {
        titulo.textContent = 'Buscador + Galería + Peso (Admin)';
        botonAleatorio.classList.remove('hidden');
        zonaTablaBtn.classList.remove('hidden');
    } else if (rolActual === 'boss') {
        titulo.textContent = 'Buscador + Galería + Salud (Boss)';
        botonAleatorio.classList.remove('hidden');
        zonaTablaBtn.classList.remove('hidden');
        botonTabla.textContent = 'Ver tabla de peso y consejo de salud';
    } else {
        titulo.textContent = 'Buscador de Perritos (Cliente)';
    }
}

botonBuscar.addEventListener('click', buscarPerro);
botonAleatorio.addEventListener('click', buscarAleatorio);
botonTabla.addEventListener('click', mostrarTablaPeso);
cajaTexto.addEventListener('keypress', e => {
    if (e.key === 'Enter') buscarPerro();
});

iniciarVistaPorRol();