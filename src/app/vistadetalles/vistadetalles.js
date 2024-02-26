//obtenerFacturas(); Ya lo llama en el admin.js

async function obtenerFacturas(){
    try{
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getFacturasDetalles');
        const data = await response.json();
        if(response.ok){
            mostrarFacturasDetalles(data);
        }else{
            console.error('Error al obtener las facturas con detalles')
        }
    }catch(error){
        console.error('Error al obtener las facturas con detalles', error);
    }
} 

function mostrarFacturasDetalles(facturas){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    facturas.forEach(factura =>{
        // Parsear la fecha de envío en formato "año-mes-día"
        const fechaEnvio = new Date(factura.fechaenvio);
        const diae = fechaEnvio.getDate();
        const mese = fechaEnvio.getMonth() + 1; // Sumar 1 porque en JavaScript los meses van de 0 a 11
        const anioe = fechaEnvio.getFullYear();
        const fechaFormateadaEnvio = `${diae}/${mese}/${anioe}`;

        //FECHA PEDIDO
        // Parsear la fecha de envío en formato "año-mes-día"
        const fechaPedido = new Date(factura.fechapedido);
        
        // Obtener día, mes y año de la fecha de envío
        const diap = fechaPedido.getDate();
        const mesp = fechaPedido.getMonth() + 1; // Sumar 1 porque en JavaScript los meses van de 0 a 11
        const aniop = fechaPedido.getFullYear();
        const fechaFormateadaPedido = `${diap}/${mesp}/${aniop}`;

        const row = document.createElement('tr');
        
        // Celdas para los datos del producto
        const dataCells = `
            <td>${factura.idfactura}</td>
            <td>${factura.id_nombrescompletos}</td>
            <td>${fechaFormateadaPedido}</td>
            <td>${factura.totalpedido}</td>
            <td>${factura.estado}</td>
            <td>${fechaFormateadaEnvio}</td>
            <td>${factura.productos}</td>
        `;
        row.innerHTML = dataCells;
        tbody.appendChild(row);
    });
}