const apiKey = 'live_C4Q9wVJG0cnMC6BYoQ3X7Gt8e8RyMxYYBXWUiymAK23DnGjJQR4eQd46StPme3lg';

const txtBuscar = document.getElementById('textoBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const btnRandom = document.getElementById('btnAleatorio');
const boxBtnPeso = document.getElementById('cajaBotonPeso');
const btnPeso = document.getElementById('btnPeso');

const boxRes = document.getElementById('resultado');
const boxFoto1 = document.getElementById('fotoSola');
const boxFotos4 = document.getElementById('fotosVarias');
const boxError = document.getElementById('errorPerro');

const imgDog = document.getElementById('imgPerro');
const txtNombre = document.getElementById('nombrePerro');
const txtTemp = document.getElementById('personalidadPerro');
const txtVida = document.getElementById('vidaPerro');
const txtOrigen = document.getElementById('origenPerro');

const boxPeso = document.getElementById('cajaPeso');
const bodyPeso = document.getElementById('cuerpoTablaPeso');
const txtConsejo = document.getElementById('consejo');

const btnLike = document.getElementById('btnLike');
const boxRank = document.getElementById('zonaRanking');
const listRank = document.getElementById('listaRanking');

const btnFav = document.getElementById('btnFav');
const boxFavs = document.getElementById('zonaFavs');
const listFavs = document.getElementById('listaFavs');

const boxReg = document.getElementById('zonaRegistros');
const formReg = document.getElementById('formRegistro');
const hidId = document.getElementById('idEditar');
const inpRaza = document.getElementById('razaInput');
const inpNota = document.getElementById('notaInput');
const bodyReg = document.getElementById('cuerpoRegistros');

let rol = 'cliente';
let userName = 'invitado';
let dogActual = null;

function leerSesion() {
    const sesion = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    if (!sesion) {
        window.location.href = 'sesion.html';
        return;
    }
    rol = sesion.rol ? sesion.rol.toLowerCase() : 'cliente';
    userName = sesion.usuario || 'cliente';
}

function esAdminOBoss() {
    return rol === 'admin' || rol === 'boss';
}

function pintarDog(dog, fotos) {
    dogActual = dog;

    txtNombre.textContent = dog.name;
    txtTemp.textContent = dog.temperament || 'No especificado';
    txtVida.textContent = dog.life_span || 'No especificado';
    txtOrigen.textContent = dog.origin || 'Desconocido';

    const foto1 = fotos.length > 0 ? fotos[0].url : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1';

    if (esAdminOBoss()) {
        boxFoto1.classList.add('ocultar');
        boxFotos4.classList.remove('ocultar');
        boxFotos4.innerHTML = '';

        for (let i = 0; i < fotos.length; i++) {
            const img = document.createElement('img');
            img.src = fotos[i].url;
            img.alt = 'Foto de ' + dog.name;
            boxFotos4.appendChild(img);
        }
    } else {
        boxFotos4.classList.add('ocultar');
        boxFoto1.classList.remove('ocultar');
        imgDog.src = foto1;
        imgDog.alt = 'Foto de ' + dog.name;
    }

    boxError.classList.add('ocultar');
    boxRes.classList.remove('ocultar');

    if (esAdminOBoss() && !boxPeso.classList.contains('ocultar')) {
        verPeso();
    }
}

function pedirFotos(dog) {
    let lim = 1;
    if (esAdminOBoss()) {
        lim = 4;
    }

    fetch('https://api.thedogapi.com/v1/images/search?breed_ids=' + dog.id + '&limit=' + lim, {
        headers: { 'x-api-key': apiKey }
    })
    .then(res => res.json())
    .then(fotos => {
        pintarDog(dog, fotos);
    })
    .catch(err => console.log(err));
}

function buscarRaza() {
    const q = txtBuscar.value.trim();
    if (q === '') return;

    fetch('https://api.thedogapi.com/v1/breeds/search?q=' + q, {
        headers: { 'x-api-key': apiKey }
    })
    .then(res => res.json())
    .then(lista => {
        if (lista.length === 0) {
            boxRes.classList.add('ocultar');
            boxError.classList.remove('ocultar');
            return;
        }
        pedirFotos(lista[0]);
    })
    .catch(err => console.log(err));
}

function perroRandom() {
    fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1', {
        headers: { 'x-api-key': apiKey }
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.length > 0 && datos[0].breeds.length > 0) {
            txtBuscar.value = '';
            const dog = datos[0].breeds[0];

            if (esAdminOBoss()) {
                pedirFotos(dog);
            } else {
                pintarDog(dog, [{ url: datos[0].url }]);
            }
        }
    })
    .catch(err => console.log(err));
}

function pintarPeso(pesoStr) {
    const limpio = (pesoStr || '').trim();
    const partes = limpio.split('-');
    const maxP = parseFloat(partes[partes.length - 1]);

    if (isNaN(maxP)) {
        bodyPeso.innerHTML = '<tr><td>' + dogActual.name + '</td><td>No disponible</td><td>-</td></tr>';
        if (rol === 'boss') {
            txtConsejo.textContent = 'Consejo: consulta con el veterinario el peso ideal.';
            txtConsejo.classList.remove('ocultar');
        }
        boxPeso.classList.remove('ocultar');
        return;
    }

    let tam = 'Mediano';
    let tip = 'Paseo diario y porciones medidas.';

    if (maxP <= 10) {
        tam = 'Pequeño';
        tip = 'Croquetas pequeñas y cuidar dientes y saltos.';
    } else if (maxP > 25) {
        tam = 'Grande';
        tip = 'Cuidar articulaciones y no correr tras comer.';
    }

    bodyPeso.innerHTML = '<tr><td>' + dogActual.name + '</td><td>' + limpio + ' kg</td><td>' + tam + '</td></tr>';

    if (rol === 'boss') {
        txtConsejo.textContent = 'Consejo: ' + tip;
        txtConsejo.classList.remove('ocultar');
    } else {
        txtConsejo.classList.add('ocultar');
    }

    boxPeso.classList.remove('ocultar');
}

function verPeso() {
    if (!dogActual) {
        alert('Primero busca una raza o da clic en Aleatorio');
        return;
    }

    if (dogActual.weight && dogActual.weight.metric) {
        pintarPeso(dogActual.weight.metric);
    } else {
        fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': apiKey }
        })
        .then(res => res.json())
        .then(razas => {
            const found = razas.find(r => r.id === dogActual.id || r.name === dogActual.name);
            pintarPeso(found && found.weight ? found.weight.metric : '');
        })
        .catch(() => pintarPeso(''));
    }
}

function getRank() {
    return JSON.parse(localStorage.getItem('rankingPerritos')) || [];
}

function saveRank(list) {
    localStorage.setItem('rankingPerritos', JSON.stringify(list));
}

function keyVotes() {
    return 'votos_' + userName;
}

function darLike() {
    if (!dogActual) {
        alert('Primero busca una raza o da clic en Aleatorio');
        return;
    }

    const votes = JSON.parse(localStorage.getItem(keyVotes())) || [];
    if (votes.includes(dogActual.name)) {
        alert('Ya le diste me gusta a ' + dogActual.name);
        return;
    }

    votes.push(dogActual.name);
    localStorage.setItem(keyVotes(), JSON.stringify(votes));

    const list = getRank();
    let found = false;

    for (let i = 0; i < list.length; i++) {
        if (list[i].raza === dogActual.name) {
            list[i].votos = list[i].votos + 1;
            found = true;
            break;
        }
    }

    if (!found) {
        list.push({ raza: dogActual.name, votos: 1 });
    }

    list.sort(function (a, b) {
        return b.votos - a.votos;
    });

    saveRank(list);

    if (rol === 'boss') {
        pintarRank();
    }

    alert('Te gustó ' + dogActual.name);
}

function pintarRank() {
    if (rol !== 'boss') {
        boxRank.classList.add('ocultar');
        return;
    }

    const list = getRank();
    listRank.innerHTML = '';

    if (list.length === 0) {
        listRank.innerHTML = '<li>Aún no hay votos registrados.</li>';
        return;
    }

    for (let i = 0; i < list.length; i++) {
        const li = document.createElement('li');
        li.textContent = list[i].raza + ' — ' + list[i].votos + ' me gusta';
        listRank.appendChild(li);
    }
}

function keyFav() {
    return 'favs_' + userName;
}

function addFav() {
    if (!dogActual || rol !== 'cliente') return;
    const favs = JSON.parse(localStorage.getItem(keyFav())) || [];
    if (!favs.includes(dogActual.name)) {
        favs.push(dogActual.name);
        localStorage.setItem(keyFav(), JSON.stringify(favs));
        pintarFavs();
    }
}

function delFav(name) {
    if (rol !== 'cliente') return;
    const favs = JSON.parse(localStorage.getItem(keyFav())) || [];
    const next = favs.filter(x => x !== name);
    localStorage.setItem(keyFav(), JSON.stringify(next));
    pintarFavs();
}

function pintarFavs() {
    const favs = JSON.parse(localStorage.getItem(keyFav())) || [];
    listFavs.innerHTML = '';

    if (favs.length === 0) {
        listFavs.innerHTML = '<li class="list-group-item">Sin favoritos aún.</li>';
        return;
    }

    for (let i = 0; i < favs.length; i++) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
        li.innerHTML = '<span>' + favs[i] + '</span>' +
            '<button type="button" class="btn btn-sm btn-oscuro mt-0" onclick="delFav(\'' + favs[i].replace(/'/g, '') + '\')">Quitar</button>';
        listFavs.appendChild(li);
    }
}

function getRegs() {
    return JSON.parse(localStorage.getItem('registrosRazas')) || [];
}

function saveRegs(list) {
    localStorage.setItem('registrosRazas', JSON.stringify(list));
}

function guardarReg(ev) {
    ev.preventDefault();
    if (!esAdminOBoss()) return;

    const raza = inpRaza.value.trim();
    const nota = inpNota.value.trim();
    if (raza === '' || nota === '') return;

    const list = getRegs();
    const id = hidId.value;

    if (id) {
        for (let i = 0; i < list.length; i++) {
            if (String(list[i].id) === String(id)) {
                list[i].raza = raza;
                list[i].nota = nota;
            }
        }
        hidId.value = '';
    } else {
        list.push({ id: Date.now(), raza: raza, nota: nota });
    }

    saveRegs(list);
    formReg.reset();
    pintarRegs();
}

function editReg(id) {
    if (!esAdminOBoss()) return;
    const list = getRegs();
    for (let i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id)) {
            hidId.value = list[i].id;
            inpRaza.value = list[i].raza;
            inpNota.value = list[i].nota;
            break;
        }
    }
}

function delReg(id) {
    if (!esAdminOBoss()) return;
    const list = getRegs().filter(x => String(x.id) !== String(id));
    saveRegs(list);
    pintarRegs();
}

function pintarRegs() {
    const list = getRegs();
    bodyReg.innerHTML = '';

    if (list.length === 0) {
        bodyReg.innerHTML = '<tr><td colspan="3" class="text-center">Sin registros.</td></tr>';
        return;
    }

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        bodyReg.innerHTML += '<tr>' +
            '<td>' + item.raza + '</td>' +
            '<td>' + item.nota + '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-sm me-1" onclick="editReg(' + item.id + ')">Editar</button>' +
                '<button type="button" class="btn btn-sm btn-oscuro mt-0" onclick="delReg(' + item.id + ')">Borrar</button>' +
            '</td>' +
        '</tr>';
    }
}

function configurarRol() {
    leerSesion();

    btnRandom.classList.add('ocultar');
    boxBtnPeso.classList.add('ocultar');
    boxPeso.classList.add('ocultar');
    txtConsejo.classList.add('ocultar');
    boxRank.classList.add('ocultar');
    btnFav.classList.add('ocultar');
    boxFavs.classList.add('ocultar');
    boxReg.classList.add('ocultar');

    if (esAdminOBoss()) {
        btnRandom.classList.remove('ocultar');
        boxBtnPeso.classList.remove('ocultar');
        boxReg.classList.remove('ocultar');
        if (rol === 'boss') {
            btnPeso.textContent = 'Ver tabla de peso y consejo';
            boxRank.classList.remove('ocultar');
            pintarRank();
        }
        pintarRegs();
    } else {
        btnFav.classList.remove('ocultar');
        boxFavs.classList.remove('ocultar');
        pintarFavs();
    }
}

btnBuscar.onclick = buscarRaza;
btnRandom.onclick = perroRandom;
btnPeso.onclick = verPeso;
btnLike.onclick = darLike;
btnFav.onclick = addFav;
formReg.onsubmit = guardarReg;
txtBuscar.onkeypress = function (e) {
    if (e.key === 'Enter') buscarRaza();
};

configurarRol();