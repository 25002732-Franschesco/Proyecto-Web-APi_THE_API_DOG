const usuariosIniciales = [
    { usuario: 'admin', pass: '1234', rol: 'admin' },
    { usuario: 'cliente', pass: '12345', rol: 'cliente' },
    { usuario: 'boss', pass: '123456', rol: 'boss' }
];

if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
}

function registrar(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('usuarioReg').value.trim();
    const clave = document.getElementById('claveReg').value.trim();
    const rol = document.getElementById('rolReg').value;

    if (nombre === '' || clave === '') return;

    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const repetido = lista.some(item => item.usuario === nombre);

    if (repetido) {
        alert('Ese usuario ya existe');
        return;
    }

    lista.push({ usuario: nombre, pass: clave, rol: rol });
    localStorage.setItem('usuarios', JSON.stringify(lista));
    localStorage.setItem('usuarioNuevo', nombre);

    alert('Cuenta creada');
    window.location.href = './html/sesion.html';
}