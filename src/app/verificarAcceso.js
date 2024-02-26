document.addEventListener('DOMContentLoaded', function() {
    const idTipoUsuario = localStorage.getItem('idTipoUsuario');
    const usuarioLogueado = localStorage.getItem('nombreUsuario') !== null;

    // Lista de páginas permitidas para cada tipo de usuario
    const paginasPermitidasAdministrador = [
        'administrador.html',
        'vistaproductos.html',
        'vistadetalles.html',
        'vistaenvios.html',
        'vistaclientes.html',
        'home.html',
        'productos.html',
        'perfil.html',
        'nosotros.html'
    ];

    const paginasPermitidasCliente = [
        'perfil.html',
        'productos.html',
        'home.html',
        'nosotros.html',
        'carritocompra.html'
    ];

    // Verificar si el usuario tiene acceso a la página actual
    if (usuarioLogueado) {
        if (idTipoUsuario === '1') {
            permitirAcceso(paginasPermitidasAdministrador);
        } else if (idTipoUsuario === '2') {
            permitirAcceso(paginasPermitidasCliente);
        } else {
            redirigirASesion();
        }
    } else {
        permitirAcceso(['home.html', 'productos.html', 'nosotros.html']);
    }
});

function permitirAcceso(paginasPermitidas) {
    const paginaActual = obtenerNombrePaginaActual();
    if (!paginasPermitidas.includes(paginaActual)) {
        redirigirASesion();
    }
}

function redirigirASesion() {
    window.location.href = 'http://127.0.0.1:5500/FrVeterinaria/src/app/home/home.html'; // Cambia la URL según tu estructura de archivos
}

function obtenerNombrePaginaActual() {
    const rutaCompleta = window.location.pathname;
    const partesRuta = rutaCompleta.split('/');
    return partesRuta[partesRuta.length - 1];
}
