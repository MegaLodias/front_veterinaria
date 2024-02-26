//obtenerEnvios(); Ya llama de vistaenvios.js

async function obtenerEnvios(){
    try{
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getEnvios');
        const data = await response.json();
        if(response.ok){
            mostrarEnvios(data);
        }else{
            console.error('Error al obtener las facturas')
        }
    }catch(error){
        console.error('Error al obtener las facturas', error);
    } 
}

function mostrarEnvios(envios){

    //A ver ya meti la pata, pero x
    
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    envios.forEach(envio =>{
        let fechaenviodo='';
        //  Metida 2 de pata pero x
        // Parsear la fecha de envío en formato "año-mes-día"
        if(envio.envio_fecha!==null){
            const fechaEnvio = new Date(envio.envio_fecha);
        
        // Obtener día, mes y año de la fecha de envío
            const dia = fechaEnvio.getDate();
            const mes = fechaEnvio.getMonth() + 1; // Sumar 1 porque en JavaScript los meses van de 0 a 11
            const anio = fechaEnvio.getFullYear();
            
            // Formatear la fecha en formato "día/mes/año"
            const fechaFormateada = `${dia}/${mes}/${anio}`;
            //console.log(fechaFormateada); Se pudo, Martha
            //Prosperemos
            fechaenviodo=fechaFormateada;
        }else{
            fechaenviodo='Aun está pendiente';
        }
        
        console.log("fuera del if");

        const row = document.createElement('tr');
        
        // Celdas para los datos del producto
        const dataCells = `
            <td>${envio.id_facturas}</td>
            <td>${fechaenviodo}</td>
            <td>${envio.user_nombre}  ${envio.user_apellido}</td>
            <td>${envio.envio_estado}</td>
        `;
        row.innerHTML = dataCells;

        // Celda para el botón "Actualizar"
        const updateCell = document.createElement('td');
        const botonActualizar = document.createElement('button');
        botonActualizar.classList.add('boton-item');
        botonActualizar.textContent = 'Actualizar';
        botonActualizar.addEventListener('click', () => {
            //decidir(fechaenviodo);
            if(fechaenviodo === 'Aun está pendiente'){
                mostrarDatosEnvio(envio, fechaenviodo); //MUESTRA DATOS EN VENTANA EMERGENTE
            } else {
                console.log('Ya están los productos siendo enviados.');
                // Swal.fire({
                //     title: 'No se puede actualizar el envío',
                //     text: 'El envío ya ha sido realizado y no se puede actualizar.',
                //     icon: 'warning',
                //     confirmButtonText: 'Aceptar'
                // });
            }
        });
        updateCell.appendChild(botonActualizar);
        row.appendChild(updateCell);

        // Agregar la fila completa a la tabla
        tbody.appendChild(row);
    });
}

function mostrarDatosEnvio(envio, fechaformateada) {    

    const modalContent = document.getElementById('modal-contenido');
    modalContent.innerHTML = `
    <h2 for="idfactura">Factura</h2>
    <label for="idfactura">N° Factura:</label>
    <p id="idfactura" readonly>${envio.id_facturas}</p>
    <label for="fecha">Fecha de envío:</label>
    <p id="fecha" readonly>${fechaformateada}</p>
    <label for="nombre">Cliente:</label>
    <p id="nombre" readonly>${envio.user_nombre} ${envio.user_apellido}</p>
    <label for="estado">Estado de envío:</label>
    <select id="estado">
        <option value="ENVIADO" ${envio.envio_estado === 'ENVIADO' ? 'selected' : ''}>Enviado</option>
        <option value="PENDIENTE" ${envio.envio_estado === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
    </select><br>
        <button type="button" id="guardar">Guardar Cambios</button>
        <button type="button" id="cerrar">Cerrar</button>
    `;

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    
    // Agregar evento al botón "Guardar Cambios
    const botonGuardar = document.getElementById('guardar');
    botonGuardar.addEventListener('click', () => {
        console.log(envio.id_envio);
        //guardarCambiosEnvio(envio.id_envio, obtenerDatosFormularioEnvio());
        //actualizarEnvio(envio.id_facturas, obtenerDatosFormularioEnvio());
        guardarEnvioFecha(envio.id_envio);
        modal.style.display = 'none';
        // Mostrar mensaje SweetAlert después de cerrar el modal
        Swal.fire({
            icon: 'success',
            title: '¡Pedido Enviado!',
            text: 'El pedido ha sido enviado correctamente.',
        });
    });

    const botonCerrar = document.getElementById('cerrar');
    botonCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

async function guardarEnvioFecha(idenvio){
    try {
        const response = await fetch(`https://backend-veterinaria-hpjh.onrender.com/api/actualizarEnvioFecha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idenvio: idenvio })
        });
        if (response.ok) {
            console.log('Estado del envio actualizado con éxito');
            await obtenerEnvios();
        } else {
            console.error('Error al actualizar el estado del envio');
        }
    } catch (error) {
        console.error('Error de red al actualizar el esrado del envio', error);
    }
}
