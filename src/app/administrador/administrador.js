
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
              <li class='logoN'><a><img src='../../assets/img/logo.png'/></a></li>
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
function cerrarSesion() {
  localStorage.clear();
  window.location.href = '../login/login.html'; // Cambia la ruta según tu estructura de archivos
}


function mostrarComponente(componenteId) {
    // Ocultar todos los componentes
    ocultarTodosComponentes();
  
    // Mostrar el componente seleccionado
    mostrarComponentePorId(componenteId);
  }
  
  function ocultarTodosComponentes() {
    // Ocultar todos los componentes
    ocultarComponentePorId('vistaproductos');
    ocultarComponentePorId('vistafacturas');
    ocultarComponentePorId('vistaclientes');
  }
  
  function mostrarComponentePorId(componenteId) {
    // Construir la ruta al componente según el ID dado
    var rutaComponente = '../' + componenteId + '/' + componenteId + '.html';
    
    // Mostrar el componente con la ruta dada
    fetch(rutaComponente)
      .then(response => response.text())
      .then(html => {
        var contenedor = document.querySelector('.mi-componentess');
        contenedor.innerHTML = html;
        if (componenteId === 'vistaclientes') {
          var rutaScript = '../vistaclientes/vistaclientes.js';
          cargarScript(rutaScript);
        }
        if (componenteId === 'vistaenvios') {
          var rutaScript = '../vistaenvios/vistaenvios.js';
          cargarScript(rutaScript);
        }
        if (componenteId === 'vistaproductos') {
          var rutaScript = '../vistaproductos/vistaproductos.js';
          cargarScript(rutaScript);
        }
        if (componenteId === 'vistadetalles') {
          var rutaScript = '../vistadetalles/vistadetalles.js';
          cargarScript(rutaScript);
        }
      });
  }
  
  function ocultarComponentePorId(componenteId) {
    // Ocultar el componente con el ID dado
    var componente = document.getElementById(componenteId);
    if (componente) {
      componente.style.display = 'none';
    }
  }

  function cargarScript(rutaScript) {
    ocultarTodosComponentes();
    var script = document.createElement('script');
    script.src = rutaScript;
    script.onload = function() {
      // Una vez que el script se haya cargado correctamente, ejecutar obtenerDatos si está definido en el script
      if (typeof obtenerDatos === 'function') {
        obtenerDatos();
      }
      if (typeof obtenerFacturas === 'function') {
        obtenerFacturas();
      }
      if (typeof obtenerEnvios === 'function') {        
        obtenerEnvios();
      }
      if (typeof obtenerProductosCategoria === 'function') {        
        obtenerProductosCategoria();
      }
      
    };
    document.head.appendChild(script);
  }

