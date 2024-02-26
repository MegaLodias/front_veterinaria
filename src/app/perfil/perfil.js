document.addEventListener('DOMContentLoaded', function() {
    const logueado = verificarLogueo(); // Verifica si el usuario está logueado
    const esAdmin = verificarAdmin(); // Verifica si el usuario es administrador
    actualizarNavbar(logueado, esAdmin); // Actualiza el navbar según el estado de logueo y si es administrador

    function verificarLogueo() {
        return localStorage.getItem('nombreUsuario') !== null; // Verifica si hay un nombre de usuario en el localStorage
    }

    function verificarAdmin() {
        return localStorage.getItem('idTipoUsuario') === '1'; // Verifica si el usuario tiene el tipo de usuario de administrador
    }

    function actualizarNavbar(logueado, esAdmin) {
        const navbar = document.querySelector('.nav-bar');

        const nombreUsuario = localStorage.getItem('nombreUsuario');
        const apellidoUsuario = localStorage.getItem('apellidoUsuerio');
        const correoElectronico = localStorage.getItem('emailUsuario');

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
                            else {
                                // Agregar el enlace al carrito solo si no es un administrador
                                navbarContent += `<li><a href="../carritocompra/carritocompra.html">Carrito</a></li>`;
                            }  
                            navbarContent += `
                                <li><a onclick="cerrarSesion()" href="#">Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </li>
                    <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
                </span>
                <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            `;
            navbar.innerHTML = navbarContent;
            
             // Aquí actualizamos la sección de perfil-usuario-bio
             const bioSection = document.querySelector('.perfil-usuario-bio');
             const bioContent = `<h3 class="titulo">${nombreUsuario} ${apellidoUsuario}`;
             bioSection.innerHTML = bioContent;

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
                <!--  <li><a routerLink="/administrador">Administración</a></li> solo es visible cuando esta en usuario-admi -->
                <li><a href="../login/login.html">IniciarSesion</a></li>
                <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
            </span>
            <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            `;
        }
    }
});


//document.addEventListener('DOMContentLoaded', cargarDatosUsuario);
//const idTipoUsuario = localStorage.getItem('idTipoUsuario');
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosUsuario(); // Llama a la función cargarDatosUsuario al cargar el DOM
    
    const idTipoUsuario = localStorage.getItem('idTipoUsuario');
    console.log(idTipoUsuario);
    
    // Verificar si idTipoUsuario es igual a 1
    if (idTipoUsuario === '1') {
        // Si es igual a 1, mostrar la sección de facturas
        document.getElementById('seccionFacturas').style.display = 'none';
    } else {
        // Si no es igual a 1, ocultar la sección de facturas
        document.getElementById('seccionFacturas').style.display = 'block';
    }
});


function cargarDatosUsuario() {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const apellidoUsuario = localStorage.getItem('apellidoUsuerio');
    const cedulaUsuario = localStorage.getItem('cedulaUsuario');
    const emailUsuario = localStorage.getItem('emailUsuario');
    const fotoUsuario = localStorage.getItem('fotoUsuario');
    

    document.getElementById("email").value = emailUsuario || '';    
    document.getElementById("apellido").value = apellidoUsuario || '';
    document.getElementById("cedula").value = cedulaUsuario || '';
    document.getElementById("nombre").value = nombreUsuario;
    document.getElementById("nombre1").innerText = nombreUsuario + ' ' + apellidoUsuario;
    const avatarElement = document.getElementById("avatar");
    if (fotoUsuario) {
        avatarElement.src = fotoUsuario;
    } else {
        // Si no hay imagen en el Local Storage, mostrar una imagen predeterminada
        avatarElement.src = "../../assets/img/avatar.png";
    }


    obtenerDireccion();
    obtenerFcaturasPorUsuario();
}

document.addEventListener('DOMContentLoaded', cargarDatosUsuario);
window.addEventListener('load', cargarDatosUsuario);
document.addEventListener('DOMContentLoaded', obtenerDireccion);
window.addEventListener('load', obtenerDireccion);
// Llamar a cargarDatosUsuario() primero
//cargarDatosUsuario();

// Registrar el listener para el evento DOMContentLoaded
//document.addEventListener('DOMContentLoaded', cargarDatosUsuario);


//ESTA VA PARA OBTENER LA DIRECCION
async function obtenerDireccion() {
    const email = localStorage.getItem('emailUsuario');

    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/obtenerDireccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ p_user_email: email }), 
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById("direccion").value = data[0].address_calles;
            document.getElementById("codpostal").value = data[0].address_codpostal;
            document.getElementById("canton").value = data[0].canton_nombre;
            //localStorage.setItem('canton', data[0].canton_nombre);
            localStorage.setItem('idcanton', data[0].id_canton);
            localStorage.setItem('calles', data[0].address_calles);
            localStorage.setItem('codpostal', data[0].address_codpostal);

        } else {
            // Mostrar mensaje de error
            document.getElementById("mensaje").innerText = data.error;
        }
    } catch (error) {
        console.error('Error al obtener la dirección', error);
    }
}

async function actualizarUsuario() {
    const email = localStorage.getItem('emailUsuario');
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const calle = document.getElementById("direccion").value;
    const codpostal = document.getElementById("codpostal").value;
    const canton =  localStorage.getItem('idcanton');// document.getElementById("canton").value; //Hay que tomar el id
    const foto = localStorage.getItem('fotoUsuario'); //hay que cambiar para editar la foto xd
    const cedula = document.getElementById("cedula").value;

    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/updateUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: email, nuevo_nombre: nombre, nuevo_apellido: apellido, 
                nuevo_cedula: cedula, nueva_calle: calle, nuevo_codpostal: codpostal, nuevo_id_canton: canton, nueva_foto: foto }), 
        });
        const data = await response.json();

        if (response.ok) {
            cargarDatosUsuario();
            console.log('exitoso');
            Swal.fire({
                icon: 'success',
                title: '¡Cambio exitoso!',
                text: 'Los datos del usuario se han cargado exitosamente.',
            });

        } else {
            // Mostrar mensaje de error
            document.getElementById("mensaje").innerText = data.error;
        }
    } catch (error) {
        console.error('Error al obtener la dirección', error);
    }
}

async function actualizarFotoPerfil(){
    const foto = document.getElementById('nuevaFotoURL').value;
    localStorage.setItem('fotoUsuario', foto);

    actualizarUsuario();
    setTimeout(() => {
        cerrarVentanaEmergente();
    }, 1500 );

}

async function obtenerFcaturasPorUsuario(){
    const idcliente = localStorage.getItem('idUsuario');
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/obtenerFacturaUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idcliente: idcliente })
        });
        const data = await response.json();        
        if (response.ok) {
            mostrarFacturasPorUsuario(data); //muestra en la tablita
        } else {
            console.error('Error al obtener datos de facutra del usuario');
        }
    } catch (error) {
        console.error('Error al obtener la dirección', error);
    }
} 

function mostrarFacturasPorUsuario(facturasusu){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    facturasusu.forEach(factura =>{
        const row = document.createElement('tr');
        
        // Celdas para los datos del producto
        const dataCells = `
            <td>${factura.id_facturas}</td>
            <td>${factura.fac_fecha}</td>
            <td>${factura.fac_total}</td>
            <td>${factura.envio_estado}</td>
            <td>${factura.envio_fecha ? factura.envio_fecha : 'Esperando envío'}</td>
            <td>${factura.productos}</td>
        `;
        row.innerHTML = dataCells;
        tbody.appendChild(row);
    });
}

//CAMBIOS WILSON

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../login/login.html'; // Cambia la ruta según tu estructura de archivos
}

// Función para mostrar u ocultar el menú desplegable
document.getElementById("nombre1").addEventListener("click", function() {
    var menu = document.getElementById("menuDesplegable");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    const apellidoUsuario = localStorage.getItem('apellidoUsuerio') || '';
    const correoElectronico = localStorage.getItem('emailUsuario') || '';


    const nombreCompleto = nombreUsuario + ' ' + apellidoUsuario;

    const nombreApellidoElementos = document.querySelectorAll('.nombre-apellido');
    nombreApellidoElementos.forEach(function(elemento) {
        elemento.textContent = nombreCompleto;
    });

    const emailElemento = document.querySelector('.email');
    if (emailElemento) {
        emailElemento.textContent = correoElectronico;
    }
});

// Función para previsualizar la foto seleccionada
function previsualizarFoto(event) {
    const archivo = event.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            document.getElementById('avatar').src = e.target.result;
        }
        lector.readAsDataURL(archivo);
    }
}

function cambiarFotoPerfil() {
    document.getElementById("nuevaFoto").click();
}

function ajustarAltura(img) {
    if (img.naturalWidth > img.naturalHeight) {
        img.style.height = "100%";
    } else {
        img.style.height = "auto";
    }
}



 function abrirVentanaEmergente() {
        document.getElementById("fondoEmergente").style.display = "block";
        document.getElementById("ventanaEmergente").style.display = "block";
    }

    function cerrarVentanaEmergente() {
        document.getElementById("fondoEmergente").style.display = "none";
        document.getElementById("ventanaEmergente").style.display = "none";
    }

    function cambiarFotoURL() {
        var nuevaFotoURL = document.getElementById("nuevaFotoURL").value;
        var avatar = document.getElementById("avatar");
        avatar.src = nuevaFotoURL;
        cerrarVentanaEmergente();
    }