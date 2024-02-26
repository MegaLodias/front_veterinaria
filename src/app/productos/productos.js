
document.addEventListener('DOMContentLoaded', function() {
    const logueado = verificarLogueo(); // Verifica si el usuario está logueado
    actualizarNavbar(logueado); // Actualiza el navbar según el estado de logueo
    
    const esAdmin = verificarAdmin(); //AÑADIDO AHORA
    iniciarCompra(logueado, esAdmin);

    function verificarLogueo() {
        return localStorage.getItem('nombreUsuario') !== null; // Verifica si hay un nombre de usuario en el localStorage
    }
    function verificarAdmin() {
        return localStorage.getItem('idTipoUsuario') === '1'; // Verifica si el usuario tiene el tipo de usuario de administrador
    }

    function iniciarCompra(logueado, esAdmin) {
        const btnCompra = document.getElementById('btn-compra');
        if (logueado && !esAdmin) {
            btnCompra.style.display = 'block'; // Muestra el botón si el usuario está logueado
        } else {
            btnCompra.style.display = 'none'; // Oculta el botón si el usuario no está logueado
        }
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

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../login/login.html'; // Cambia la ruta según tu estructura de archivos
}

obtenerProductos();

async function obtenerProductos() {
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getProductos');
        const data = await response.json();
        if (response.ok) {
            mostrarProductos(data);
        } else {
            console.error('Error al obtener los productos');
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

//INICIA COMPRA, ES DECIR Inicia una FACTURA
async function compraIniciada(){
    if(localStorage.getItem('idFactura')===null){
        const btnMostrarMensaje = document.getElementById('btn-compra');
        btnMostrarMensaje.addEventListener('click', function() {
            // Mostrar un mensaje de SweetAlert cuando se hace clic en el botón
            Swal.fire({
                title: '¡Compra iniciada!',
                text: 'Haz iniciado tu compra, añade productos a tu carrito.',
                icon: 'success', // Puedes cambiar el icono (success, error, warning, info)
                confirmButtonText: 'Aceptar'
            });
            iniciarFactura();
        });
    }else{
        Swal.fire({
            title: '¡Ya haz iniciado una compra!',
            text: 'Haz iniciado tu compra, añade productos a tu carrito.',
            icon: 'error', // Puedes cambiar el icono (success, error, warning, info)
            confirmButtonText: 'Aceptar'
        });
    }
}

//

//

async function iniciarFactura(){
    const idUsuario = localStorage.getItem('idUsuario');
    console.log(idUsuario);
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/insertarFactura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_usuario: idUsuario }), 
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Inicia commpra con el usuaario: " + idUsuario);
            localStorage.setItem('comprainiciada', 'si');
            localStorage.setItem('idFactura', data[0].insertar_factura_pr);
        } else {
            console.error('Error al iniciar la factura');
        }

    } catch (error) {
        console.error('Error del servidor para iniciar la factura');
    }
}

//AGREGAR PRODUCTOS AL CARRITO
async function agregarAlCarrito(producto) {
    if(localStorage.getItem('idFactura')!==null){
        const result = await Swal.fire({
            title: '¿Deseas añadir a tu carrito?',
            text: 'Se ha seleccionado el producto: ' + producto.prod_nombre,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            const cantidad = await Swal.fire({
                title: 'Ingrese la cantidad',
                input: 'number',
                inputLabel: 'Cantidad',
                inputAttributes: {
                    min: 1
                },
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            });
    
            if (cantidad.isConfirmed) {
                const cantidadSeleccionada = cantidad.value;
                agregarProductoCantidad(cantidadSeleccionada, producto);
                // Aquí puedes realizar la lógica para agregar el producto al carrito con la cantidad seleccionada
            } else {
                // El usuario ha hecho clic en "Cancelar" en el diálogo de cantidad
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // El usuario ha hecho clic en "Cancelar" o en cualquier otra parte fuera del diálogo de confirmación
        }
    }else{
        Swal.fire({
            title: '¡Inicie su compra!',
            text: 'Antes de poder añadir productos a su carrito debe inicar su compra',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
    
}


async function agregarProductoCantidad(cantidad, producto){
    const idfactura= localStorage.getItem('idFactura');
    console.log(idfactura);
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/insertarDetalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idfactura: idfactura, idproducto: producto.id_prod, prodcant:cantidad }), 
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Producto Añadido");
            Swal.fire({
                title: '¡Producto añadido!',
                text: 'Haz añadido el producto a su carrito.',
                icon: 'success', // Puedes cambiar el icono (success, error, warning, info)
                confirmButtonText: 'Aceptar'
            });
        } else {
            console.error('Error al añadir el producto, no hay stock'); //solo saldrá cuando no haya stock
            Swal.fire({
                title: '¡No se ha añadido el producto!',
                text: 'Verifique la cantidad que ha ingresado.',
                icon: 'error', // Puedes cambiar el icono (success, error, warning, info)
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error del servidor para añadir producto');
    }
}


function mostrarProductos(productos) {
    const contenedorProductos = document.querySelector('.contenedor-items');

    contenedorProductos.innerHTML = ''; //MADE

    productos.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('item');

        const titulo = document.createElement('span');
        titulo.classList.add('titulo-item');
        titulo.textContent = producto.prod_nombre;
        item.appendChild(titulo);

        const imagen = document.createElement('img');
        imagen.classList.add('img-item');
        imagen.src = producto.prod_foto;
        item.appendChild(imagen);

        const descripcion = document.createElement('p');
        descripcion.classList.add('card-text');
        descripcion.textContent = producto.prod_descripcion;
        
        item.appendChild(descripcion);

        const precio = document.createElement('span');
        precio.classList.add('precio-item');
        precio.textContent = `$${producto.prod_precio}`;
        item.appendChild(precio);

        const boton = document.createElement('button');
        boton.classList.add('boton-item');
        boton.textContent = 'Agregar al Carrito';
        boton.addEventListener('click', () => {
            agregarAlCarrito(producto).then(() => {
                // Aquí puedes agregar cualquier lógica que necesites después de que el usuario haya interactuado con el diálogo
            }).catch(error => {
                console.error('Error:', error);
            });
        });
        item.appendChild(boton);

        contenedorProductos.appendChild(item);
    });
}

//QUIERO OBTENER PRODUCTOS POR CATEGORIA DE BOTONES
async function obtenerProductosCategoria(categoria) {
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/buscarProductosCategoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ p_nombre_categoria: categoria }), 
        });
        const data = await response.json();
        if (response.ok) {
            mostrarProductosCategoria(data);
        } else {
            console.error('Error al obtener los productos por la categoria');
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Función para mostrar los productos POR CATEGORIA (APROBADO)
function mostrarProductosCategoria(productos) {
    const contenedorProductos = document.querySelector('.contenedor-items');

    contenedorProductos.innerHTML = ''; //MADE

    productos.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('item');

        const titulo = document.createElement('span');
        titulo.classList.add('titulo-item');
        titulo.textContent = producto.prod_nombre;
        item.appendChild(titulo);

        const imagen = document.createElement('img');
        imagen.classList.add('img-item');
        imagen.src = producto.prod_foto;
        item.appendChild(imagen);

        const descripcion = document.createElement('p');
        descripcion.classList.add('card-text');
        descripcion.textContent = producto.prod_descripcion;
        
        item.appendChild(descripcion);

        const precio = document.createElement('span');
        precio.classList.add('precio-item');
        precio.textContent = `$${producto.prod_precio}`;
        item.appendChild(precio);

        const boton = document.createElement('button');
        boton.classList.add('boton-item');
        boton.textContent = 'Agregar al Carrito';
        boton.addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
        item.appendChild(boton);

        contenedorProductos.appendChild(item);
    });
}

