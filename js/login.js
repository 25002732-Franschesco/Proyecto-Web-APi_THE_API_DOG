const initUsers = [
    { usuario: 'cliente', pass: '1234', rol: 'cliente' },
    { usuario: 'admin', pass: '12345', rol: 'admin' },
    { usuario: 'boss', pass: '123456', rol: 'boss' }
];

function loadUsers() {
    let list = [];
    try {
        list = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch (err) {
        list = [];
    }

    if (!Array.isArray(list)) {
        list = [];
    }

    for (let i = 0; i < initUsers.length; i++) {
        const u = initUsers[i];
        const exists = list.some(item => item.usuario === u.usuario);
        if (!exists) {
            list.push(u);
        }
    }

    localStorage.setItem('usuarios', JSON.stringify(list));
    return list;
}

loadUsers();

window.onload = function () {
    const nuevo = localStorage.getItem('usuarioNuevo');
    const input = document.getElementById('usuarioLogin');

    if (nuevo && input) {
        input.value = nuevo;
        localStorage.removeItem('usuarioNuevo');
    }

    cargarDatosUsuario();
};

function entrar(ev) {
    ev.preventDefault();

    const user = document.getElementById('usuarioLogin').value.trim();
    const pass = document.getElementById('claveLogin').value.trim();
    const errBox = document.getElementById('mensajeError');

    const list = loadUsers();
    const found = list.find(u => u.usuario === user && u.pass === pass);

    if (found) {
        errBox.classList.add('ocultar');
        sessionStorage.setItem('usuarioActivo', JSON.stringify(found));
        window.location.href = 'api.html';
    } else {
        errBox.classList.remove('ocultar');
    }
}

function salir() {
    sessionStorage.removeItem('usuarioActivo');
    window.location.href = 'sesion.html';
}

function cargarDatosUsuario() {
    const sesion = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    const label = document.getElementById('infoUsuario');

    if (label) {
        if (!sesion) {
            window.location.href = 'sesion.html';
            return;
        }
        label.textContent = 'Usuario: ' + sesion.usuario + ' (' + sesion.rol + ')';
    }
}