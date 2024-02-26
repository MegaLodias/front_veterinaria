
document.addEventListener('DOMContentLoaded', function() {
    const logueado = verificarLogueo(); // Verifica si el usuario está logueado
    actualizarNavbar(logueado); // Actualiza el navbar según el estado de logueo
    

    function verificarLogueo() {
        return localStorage.getItem('nombreUsuario') !== null; // Verifica si hay un nombre de usuario en el localStorage
    }
    function verificarAdmin() {
        return localStorage.getItem('idTipoUsuario') === '1'; // Verifica si el usuario tiene el tipo de usuario de administrador
    }

    function actualizarNavbar(logueado) {
        const navbar = document.querySelector('.nav-bar');

        const nombreUsuario = localStorage.getItem('nombreUsuario');
        const apellidoUsuario = localStorage.getItem('apellidoUsuerio');
        const correoElectronico = localStorage.getItem('emailUsuario');
        const esAdmin = verificarAdmin(); //AÑADIDO AHORA

        if (logueado) {
            // Si el usuario está logueado, actualiza el navbar con el contenido correspondiente
            let navbarContent = `
                <li class='logo'><a><img src='../../assets/img/logo.png'/></a></li>
                <input type='checkbox' id='check' />
                <span class="menu">
                    <li><a href="../home/home.html" >Inicio</a></li>
                    <li><a href="../productos/productos.html" >Productos</a></li>
                    <li><a href="../nosotros/nosotros.html">Nosotros</a></li>
                    <li> 
                        <a id="nombre1" href="#">${nombreUsuario} ${apellidoUsuario}</a> 
                        <div id="menuDesplegable" class="menu-desplegable"> 
                            <div class="perfil-info">
                                <h1 class="nombre-apellido">${nombreUsuario} ${apellidoUsuario}</h1>
                                <h3 class="email">${correoElectronico}</h3>
                            </div>
                            <ul class="menu-opciones">
                                <li><a href="../perfil/perfil.html">Mi Perfil</a></li>`;  
                                if (esAdmin) {
                                    navbarContent += `<li><a href="../administrador/administrador.html">Administrar</a></li>`;
                                    }
                                    else {
                                        // Agregar el enlace al carrito solo si no es un administrador
                                        navbarContent += `<li><a href="../carritocompra/carritocompra.html">Carrito</a></li>`;
                                    }                                
                                    navbarContent += `
                                <li><a onclick="cerrarSesion()" href="../login/login.html">Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </li>
                    <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
                </span>
                <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            `;
            navbar.innerHTML = navbarContent;
            // Función para mostrar u ocultar el menú desplegable
            document.getElementById("nombre1").addEventListener("click", function() {
                var menu = document.getElementById("menuDesplegable");
                if (menu.style.display === "block") {
                    menu.style.display = "none";
                } else {
                    menu.style.display = "block";
                }
            });
        } else {
            // Si el usuario no está logueado, muestra el navbar predeterminado
            navbar.innerHTML = `
            <li class='logo'><a><img src='../../assets/img/logo.png'/></a></li>
            <input type='checkbox' id='check' />
            <span class="menu">
                <li><a href="../home/home.html" >Inicio</a></li>
                <li><a href="../productos/productos.html" >Productos</a></li>
                <li><a href="../nosotros/nosotros.html">Nosotros</a></li>
                <li><a href="../login/login.html">IniciarSesion</a></li>
                <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
            </span>
            <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            `;
        }
    }
});

//CON FEEEEEEEE

// Función para cerrar sesión
// Función para cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../login/login.html'; // Cambia la ruta según tu estructura de archivos
}
