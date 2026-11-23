const usuariosBase = [
    { usuario: 'admin', pass: '1234', rol: 'Admin', url: './html/api.html' },
    { usuario: 'cliente', pass: '12345', rol: 'Cliente', url: './html/api.html' },
    { usuario: 'jefe', pass: '123456', rol: 'Boss', url: './html/api.html' }
];

if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosBase));
}

function registrarUsuario(e) {
    e.preventDefault();

    const nuevoUser = document.getElementById('regUser').value.trim();
    const nuevaPass = document.getElementById('regPass').value.trim();
    const nuevoRol = document.getElementById('regRol').value;

    if (nuevoUser === '' || nuevaPass === '') return;

    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const existe = listaUsuarios.some(u => u.usuario === nuevoUser);
    if (existe) {
        alert('Ese usuario ya existe');
        return;
    }

    const nuevoRegistro = {
        usuario: nuevoUser,
        pass: nuevaPass,
        rol: nuevoRol,
        url: './html/api.html'
    };

    listaUsuarios.push(nuevoRegistro);
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
    localStorage.setItem('usuarioRecienCreado', nuevoUser);

    alert('Usuario guardado. Ahora inicia sesión.');
    window.location.href = './html/sesion.html';
}