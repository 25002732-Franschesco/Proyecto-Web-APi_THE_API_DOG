const usuariosBase = [
    { usuario: 'admin', pass: '1234', rol: 'admin' },
    { usuario: 'cliente', pass: '12345', rol: 'cliente' },
    { usuario: 'boss', pass: '123456', rol: 'boss' }
];

if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosBase));
}

window.onload = function () {
    const nuevo = localStorage.getItem('usuarioNuevo');
    const input = document.getElementById('usuarioLogin');

    if (nuevo && input) {
        input.value = nuevo;
        localStorage.removeItem('usuarioNuevo');
    }

    cargarDatosUsuario();
};

function entrar(evento) {
    evento.preventDefault();

    const user = document.getElementById('usuarioLogin').value.trim();
    const pass = document.getElementById('claveLogin').value.trim();
    const error = document.getElementById('mensajeError');

    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const encontrado = lista.find(u => u.usuario === user && u.pass === pass);

    if (encontrado) {
        error.classList.add('ocultar');
        sessionStorage.setItem('usuarioActivo', JSON.stringify(encontrado));
        window.location.href = 'api.html';
    } else {
        error.classList.remove('ocultar');
    }
}

function salir() {
    sessionStorage.removeItem('usuarioActivo');
    window.location.href = 'sesion.html';
}

function cargarDatosUsuario() {
    const sesion = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    const etiqueta = document.getElementById('infoUsuario');

    if (sesion && etiqueta) {
        etiqueta.textContent = 'Usuario: ' + sesion.usuario + ' (' + sesion.rol + ')';
    }
}