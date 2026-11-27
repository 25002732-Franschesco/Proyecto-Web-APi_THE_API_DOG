const baseUsers = [
    { usuario: 'cliente', pass: '1234', rol: 'cliente' },
    { usuario: 'admin', pass: '12345', rol: 'admin' },
    { usuario: 'boss', pass: '123456', rol: 'boss' }
];

function getUsers() {
    let list = [];
    try {
        list = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch (err) {
        list = [];
    }

    if (!Array.isArray(list)) {
        list = [];
    }

    for (let i = 0; i < baseUsers.length; i++) {
        const u = baseUsers[i];
        const exists = list.some(item => item.usuario === u.usuario);
        if (!exists) {
            list.push(u);
        }
    }

    localStorage.setItem('usuarios', JSON.stringify(list));
    return list;
}

getUsers();

function registrar(ev) {
    ev.preventDefault();

    const name = document.getElementById('usuarioReg').value.trim();
    const pass = document.getElementById('claveReg').value.trim();
    const rol = document.getElementById('rolReg').value;

    if (name === '' || pass === '') return;

    const list = getUsers();
    const rep = list.some(item => item.usuario === name);

    if (rep) {
        alert('Ese usuario ya existe');
        return;
    }

    list.push({ usuario: name, pass: pass, rol: rol });
    localStorage.setItem('usuarios', JSON.stringify(list));
    localStorage.setItem('usuarioNuevo', name);

    alert('Cuenta creada');
    window.location.href = './html/sesion.html';
}