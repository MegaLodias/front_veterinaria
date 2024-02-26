

async function obtenerDatos() {
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/getUsuariosDireccion');
        const data = await response.json();
        if (response.ok) {
            mostrarUsuarios(data);
        } else {
            console.error('Error al obtener los usuarios');
        }
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

function mostrarUsuarios(usuarios) {
    
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = ''; // Limpiar filas existentes

    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.user_cedula}</td>
            <td>${usuario.user_nombre}</td>
            <td>${usuario.user_apellido}</td>
            <td>${usuario.address_calles}</td>
            <td>${usuario.address_codpostal}</td>
            <td>${usuario.canton_nombre}</td>
        `;
        tbody.appendChild(row);
    });
}