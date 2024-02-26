cargarCategorias();
// Función para cargar las categorías desde el API
async function cargarCategorias() {
    try {
        // Realizar la solicitud al API
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/categoriasCombobox');
        
        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Convertir la respuesta a JSON
            const categorias = await response.json();

            const selectCategorias = document.getElementById('categorias');

            selectCategorias.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = ''; 
            defaultOption.textContent = 'Selecciona una categoría'; 
            selectCategorias.appendChild(defaultOption);

            categorias.forEach(function(categoria) {
                const option = document.createElement('option');
                option.value = categoria.id_categoria; 
                option.textContent = categoria.animal_categoria; 
                selectCategorias.appendChild(option);
            });
        } else {
            console.error('Error al obtener las categorías:', response.status);
        }
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}

async function obtenerProductosCategoria(){
    try{
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getProductoCategoria');
        const data = await response.json();
        //console.log(data);
        if(response.ok){
            mostrarProductoCategoriaPrueba(data);
        }else{
            console.error('Error al obtener los productos-categoria')
        }
    }catch(error){
        console.error('Error al obtener los productos-categoria', error);
    }
}

function mostrarProductoCategoriaPrueba(prodcategorias){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    prodcategorias.forEach(prodcat =>{  
        const row = document.createElement('tr');
        
        // Celdas para los datos del producto
        const dataCells = `
            <td>${prodcat.animal_categoria}</td>
            <td>${prodcat.prod_nombre}</td>
            <td>${prodcat.prod_descripcion}</td>
            <td>${prodcat.prod_stock}</td>
            <td>${prodcat.prod_precio}</td>
        `;
        row.innerHTML = dataCells;
        //MADE ACTUALIZA CON FE

        const updateCell = document.createElement('td');
        const botonActualizar = document.createElement('button');
        botonActualizar.classList.add('boton-item');
        botonActualizar.textContent = 'Actualizar';
        botonActualizar.addEventListener('click', () => {
            mostrarDatosProducto(prodcat); //muestra en ventana emergente
        });
        
        updateCell.appendChild(botonActualizar);
        row.appendChild(updateCell);

        // Agregar la fila completa a la tabla
        tbody.appendChild(row);      
        
    });
    
}

//ESTA FUNCIONA PARA MOSTRAR LOS DATOS EN LA TABLA EN VENTANA EMERGENTE
function mostrarDatosProducto(producto) {
    // Construir el formulario de edición con los datos del producto
    const modalContent = document.getElementById('modal-contenido-actualizar');
    modalContent.innerHTML = `
        <h2>Editar Producto</h2>
        <form id="editar-producto-form" class="two-column-form">
            <div class="form-group">
                <label>Categoría:</label>
                <span>${producto.animal_categoria}</span>
            </div>
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombrea" value="${producto.prod_nombre}" required>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <textarea id="descripciona" required>${producto.prod_descripcion}</textarea>
            </div>
            <div class="form-group">
                <label for="stock">Stock:</label>
                <input type="number" id="stocka" value="${producto.prod_stock}" required>
            </div>
            <div class="form-group">
                <label for="precio">Precio:</label>
                <input type="number" id="precioa" value="${producto.prod_precio}" step="0.01" required>
            </div>
            <div class="form-actions">
                <button type="button" id="guardar">Guardar Cambios</button>
                <button type="button" id="cerrar">Cerrar</button>
            </div>
        </form>
    `;

    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Agregar eventos a los botones
    const botonGuardar = document.getElementById('guardar');
    botonGuardar.addEventListener('click', () => {
        guardarCambiosProducto(producto.id_prod, obtenerDatosFormulario());
        modal.style.display = 'none'; // Ocultar el modal al guardar cambios
        // Mostrar mensaje SweetAlert después de cerrar el modal
        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Los cambios se han guardado correctamente.',
        });
    });

    const botonCerrar = document.getElementById('cerrar');
    botonCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

//OBTENEMOS DATOS DEL PRODUCTO
function obtenerDatosFormulario() {
    // const categoria = document.getElementById('categoria').value;
    const nombre = document.getElementById('nombrea').value;
    const descripcion = document.getElementById('descripciona').value;
    const stock = document.getElementById('stocka').value;
    const precio = document.getElementById('precioa').value;
    return { nombre, descripcion, stock, precio };
}

// Función para guardar los cambios del producto
async function guardarCambiosProducto(idProducto, datos) {
    
    console.log(`Guardando cambios para el producto con ID ${idProducto}:`, datos);
    // Por ejemplo, podrías enviar los datos mediante una solicitud fetch a tu API
    try {
        const response = await fetch(`https://backend-veterinaria-hpjh.onrender.com/api/editarProductos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_prod: idProducto, 
                prod_stock: datos.stock, 
                prod_nombre: datos.nombre, 
                prod_descrip: datos.descripcion, 
                prod_precio: datos.precio})
        });
        if (response.ok) {
            console.log('Producto actualizado con éxito');
            await obtenerProductosCategoria();

        } else {
            console.error('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error de red al actualizar el producto', error);
    }
}


//MUESTRA FOMULARIO DE AGREGAR PRODUCTOS datos
async function mostrarFormularioAgregarProducto() {
    const modal = document.getElementById('modalAgregarProducto');
    modal.style.display = 'block';

}

async function insertarProductoCategoria(){
    const nombre = document.getElementById('nombre').value;
    const stock = document.getElementById('stock').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('Foto').value;
    const idcategoria = document.getElementById('categorias').value;

    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/insertarProdcuctosCategoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ p_nombre: nombre, p_stock: stock, p_descripcion: descripcion,
                p_precio: precio, p_foto: imagen, p_id_categoria: idcategoria }), 
        });
        const data = await response.json();

        if (response.ok) {
            // ...
            //cerrarFormularioAgregarProducto();
            console.log("Se puede")
            //window.location.href = 'http://127.0.0.1:5500/FrVeterinaria/src/app/administrador/administrador.html';
        } else {
            // Mostrar mensaje de error
            //document.getElementById("mensaje").innerText = data.error;
            console.log("No se puede ");
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
    }
}

// Función para cerrar el formulario de agregar producto
function cerrarFormularioAgregarProducto() {
    const modal = document.getElementById('modalAgregarProducto');
    modal.style.display = 'none';
}

document.getElementById('fotoInput').addEventListener('change', function() {
    var inputFoto = document.getElementById('fotoInput');
    var fotoUploadedIndicator = document.getElementById('fotoUploadedIndicator');

    if (inputFoto.files && inputFoto.files[0]) {
        fotoUploadedIndicator.style.display = 'inline-block';
    } else {
        fotoUploadedIndicator.style.display = 'none';
    }
});
