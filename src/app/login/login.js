

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }
});

async function iniciarSesion() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/validarUsuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_email: email, user_password: password }), 
        });
        const data = await response.json();

        if (response.ok) {
            // Inicio de sesión exitoso, redirigir al usuario a la página de perfil
            localStorage.setItem('idUsuario', data.usuario.id_user);
            localStorage.setItem('idTipoUsuario', data.usuario.id_tipouser);
            const idtipo  =  localStorage.getItem('idTipoUsuario');
            localStorage.setItem('addressUsuario', data.usuario.id_address);
            localStorage.setItem('emailUsuario', data.usuario.user_email);
            localStorage.setItem('nombreUsuario', data.usuario.user_nombre);
            localStorage.setItem('apellidoUsuerio', data.usuario.user_apellido);
            localStorage.setItem('cedulaUsuario', data.usuario.user_cedula);
            localStorage.setItem('fotoUsuario', data.usuario.user_foto);
            // ...
            if(idtipo == 2){
                window.location.href = 'http://127.0.0.1:5500/FrVeterinaria/src/app/perfil/perfil.html';
            }
            if(idtipo == 1){
                window.location.href = 'http://127.0.0.1:5500/FrVeterinaria/src/app/administrador/administrador.html';
            }
        } else {
            // Mostrar mensaje de error
          //  document.getElementById("mensaje").innerText = data.error;
            Swal.fire({
                icon: 'error',
                title: 'Contraseña incorrecta',
                text: 'Por favor, verifica tu contraseña e inténtalo de nuevo.',
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
}

//mostrar canton
window.onload = async function() {
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/cantones'); 
        const cantones = await response.json(); 

        const comboBox = document.getElementById('cantonesComboBox');

        comboBox.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = ''; 
        defaultOption.textContent = 'Selecciona un cantón'; 
        comboBox.appendChild(defaultOption);

        cantones.forEach(function(canton) {
            const option = document.createElement('option');
            option.value = canton.id_canton; 
            option.textContent = canton.canton_nombre; 
            comboBox.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener los cantones:', error);
    }
};



//fotos
const fotoInput = document.getElementById('Foto');
const fotoPreview = document.getElementById('fotoPreview');
const imagenPrevia = document.getElementById('imagenPrevia');

fotoInput.addEventListener('change', function() {
    if (fotoInput.files && fotoInput.files[0]) {
        const lector = new FileReader();

        lector.readAsDataURL(fotoInput.files[0]);

        lector.onload = function() {
            imagenPrevia.src = lector.result;
            fotoPreview.classList.add('active'); 
        };
    }
});

async function registrarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const cedula = document.getElementById("cedula").value;
    const fotoInput = document.getElementById("Foto").value;
    const cantonesComboBox = document.getElementById("cantonesComboBox").value;
    const direccion = document.getElementById("direccion").value;
    const codigoPostal = document.getElementById("codigoPostal").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    
    try {
        const response = await fetch('https://backend-veterinaria-hpjh.onrender.com/api/crearUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_email: correo, user_password: contrasena, user_nombre:nombre, 
                user_apellido: apellido, user_cedula: cedula,user_foto: fotoInput, 
                id_canton: cantonesComboBox, address_calles:direccion, address_codpostal: codigoPostal }), 
        });
        const data = await response.json();

        if (response.ok) {
            // ...
            window.location.href = 'http://127.0.0.1:5500/FrVeterinaria/src/app/login/login.html';
        } else {
            // Mostrar mensaje de error
            document.getElementById("mensaje").innerText = data.error;
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
}