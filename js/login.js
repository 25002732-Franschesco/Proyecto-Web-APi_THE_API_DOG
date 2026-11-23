const usuariosBase = [
    { usuario: 'admin', pass: '1234', rol: 'Admin', url: './html/api.html' },
    { usuario: 'cliente', pass: '12345', rol: 'Cliente', url: './html/api.html' },
    { usuario: 'jefe', pass: '123456', rol: 'Boss', url: './html/api.html' }
];

if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosBase));
}

window.onload = function() {
    const recienCreado = localStorage.getItem('usuarioRecienCreado');
    const campoUser = document.getElementById('inputUser');

    if (recienCreado && campoUser) {
        campoUser.value = recienCreado;
        localStorage.removeItem('usuarioRecienCreado');
    }

    mostrarUsuarioActivo();
};

function iniciarSesion(e) {
    e.preventDefault();

    const inputUser = document.getElementById('inputUser').value.trim();
    const inputPass = document.getElementById('inputPass').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const valido = listaUsuarios.find(u => u.usuario === inputUser && u.pass === inputPass);

    if (valido) {
        errorMsg.classList.add('hidden');
        sessionStorage.setItem('sesionActiva', JSON.stringify(valido));
        window.location.href = 'api.html';
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('sesionActiva');
    window.location.href = 'sesion.html';
}

function mostrarUsuarioActivo() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    const etiqueta = document.getElementById('usuario-activo');

    if (sesion && etiqueta) {
        etiqueta.textContent = `Usuario: ${sesion.usuario} (${sesion.rol}) — Escribe la raza a consultar:`;
    }
}