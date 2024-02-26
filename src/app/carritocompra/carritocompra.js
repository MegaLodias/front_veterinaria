
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
    obtenerDetallesFactura();
    actualizarFactura();
});

//CON FEEEEEEEE

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../login/login.html'; // Cambia la ruta según tu estructura de archivos
}

//FUNCION MOSTRAR LOS DETALLES DE FACTURA
async function obtenerDetallesFactura(){
    const idfactura = localStorage.getItem('idFactura');
    
    try{
        
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getDetalles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_facturas: idfactura }), 
        });
        
        const data = await response.json();
        if (response.ok) {
            mostrarDetallesEnCarrito(data);
            
        } else {
            console.error('Error al obtener los detalles de factura');
        }
    }catch(err){

    }
}

function mostrarDetallesEnCarrito(detalles){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = ''; // Limpiar filas existentes

    detalles.forEach(detalle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${detalle.prod_nombre}</td>
            <td>${detalle.cant_prod}</td>
            <td>${detalle.prod_precio}</td>
            <td>${detalle.fac_subtotal}</td>
        `;
        tbody.appendChild(row);
    });
}

async function actualizarFactura(){
    const idfactura = localStorage.getItem('idFactura');
    
    try{
        
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/actualizarFactura', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idfactura: idfactura }), 
        });
        
        const data = await response.json();
        if (response.ok) {
            mostrarTotal(data);
            
        } else {
            console.error('Error al obtener los detalles de factura');
        }
    }catch(err){

    }
}

function mostrarTotal(data){
    const precioTotalElemento = document.getElementById('precioTotal');
    if (precioTotalElemento && data && data.length > 0) {
        precioTotalElemento.textContent = data[0].actualizar_factura_total;

    } else {
        console.error('No se pudo actualizar el precio total.');
    }    
}

async function pagarFactura(){
    const total = document.getElementById('precioTotal').textContent;
    const result = await Swal.fire({
        title: '¿Desea terminar su compra?',
        text: 'Tiene un valor total de $' + total,
        icon: 'question', // Puedes cambiar el icono (success, error, warning, info)
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    });
    console.log('espero');
    if (result.isConfirmed) {
        console.log('en veremos')
        generarEnvio();
         // Después de generarEnvio, mostrar un segundo SweetAlert
         Swal.fire({
            icon: 'success',
            title: 'Pedido Realizado',
            text: 'Su pedido ha sido realizado correctamente.',
        }).then(() => {
            // Redirigir al usuario al perfil después de cerrar el SweetAlert
            window.location.href = '../perfil/perfil.html'; // Reemplaza '/perfil' con la URL correcta de tu perfil
        });
        console.log('se pudo');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // El usuario ha hecho clic en "Cancelar" o en cualquier otra parte fuera del diálogo de confirmación
    }
}

async function generarEnvio(){
    const idfactura = localStorage.getItem('idFactura');    
    try{
        
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/generarEnvio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idfactura: idfactura }), 
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log("Se ha generado el envio");
            localStorage.removeItem('idFactura');
        } else {
            console.error('Error al generar el envio');
        }
    }catch(err){
        console.error('Error en el servidor al generar el envio');
    }
}

