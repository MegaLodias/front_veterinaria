document.addEventListener("DOMContentLoaded", function() {
    var doneTypingInterval = 500; 

    var inputs = document.querySelectorAll('input[type="text"], select');
    inputs.forEach(function(input) {
        input.addEventListener("blur", function() {
            validateField(input);
            checkFormValidity();
        });

        input.addEventListener("input", function() {
            clearTimeout(input.typingTimer); 
            input.typingTimer = setTimeout(function() {
                if (input.id === "codigoPostal") {
                    validateCodigoPostal(input);
                } else if (input.id === "correo") {
                    validateEmail(input);
                } else if (input.id === "contrasena") {
                    validateContrasena();
                } else if (input.id === "cedula") {
                    validateCedula();
                }
                checkFormValidity();
            }, doneTypingInterval);
        });
    });

        var cantonesComboBox = document.getElementById("cantonesComboBox");
        cantonesComboBox.addEventListener("blur", function() {
            validateSelect(cantonesComboBox);
            checkFormValidity();
        });

        var correoInput = document.getElementById("correo");
        correoInput.addEventListener("blur", function() {
            validateEmail(correoInput);
            checkFormValidity();
        });
        correoInput.addEventListener("input", function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() {
                validateEmail(correoInput);
                checkFormValidity();
            }, doneTypingInterval);
        });

        var contrasenaInput = document.getElementById("contrasena");
        contrasenaInput.addEventListener("blur", function() {
            validateContrasena();
            checkFormValidity();
        });
        contrasenaInput.addEventListener("input", function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() {
                validateContrasena();
                checkFormValidity();
            }, doneTypingInterval);
        });

        var cedulaInput = document.getElementById("cedula");
        cedulaInput.addEventListener("blur", function() {
            validateCedula();
            checkFormValidity();
        });
        cedulaInput.addEventListener("input", function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() {
                validateCedula();
                checkFormValidity();
            }, doneTypingInterval);
        });

        var codigoPostalInput = document.getElementById("codigoPostal");
        codigoPostalInput.addEventListener("blur", function() {
            validateCodigoPostal(codigoPostalInput);
            checkFormValidity();
        });
        codigoPostalInput.addEventListener("input", function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() {
                validateCodigoPostal(codigoPostalInput);
                checkFormValidity();
            }, doneTypingInterval);
        });
    });

    function validateField(input) {
        var errorSpan = input.nextElementSibling;
        if (input.value === "" && input.tagName.toLowerCase() !== "select") {
            errorSpan.textContent = "Campo requerido.";
            errorSpan.style.display = "inline";
        } else {
            errorSpan.style.display = "none";
        }
    }

    function validateSelect(select) {
        var errorSpan = select.nextElementSibling;
        if (select.value === "") {
            errorSpan.textContent = "Seleccione una opción.";
            errorSpan.style.display = "inline";
        } else {
            errorSpan.style.display = "none";
        }
    }

    function validateEmail(input) {
        var emailValue = input.value.trim();
        var errorSpan = input.nextElementSibling;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === "") {
            errorSpan.textContent = "Campo requerido.";
            errorSpan.style.display = "inline";
        } else if (!emailRegex.test(emailValue)) {
            errorSpan.textContent = "Por favor, introduce un correo electrónico válido.";
            errorSpan.style.display = "inline";
        } else {
            errorSpan.style.display = "none";
        }
    }

    function validateContrasena() {
        var contrasenaInput = document.getElementById("contrasena");
        var contrasenaValue = contrasenaInput.value.trim();
        var errorSpan = contrasenaInput.nextElementSibling;

        if (contrasenaValue === "") {
            errorSpan.textContent = "Campo requerido.";
            errorSpan.style.display = "inline";
            return; 
        }

        var lengthRegex = /.{8,}/; 
        var upperCaseRegex = /[A-Z]/; 
        var lowerCaseRegex = /[a-z]/; 
        var digitRegex = /\d/; 
        var specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; 

        var errorMessages = [];

        if (!lengthRegex.test(contrasenaValue)) {
            errorMessages.push("* 8 caracteres");
        }
        if (!upperCaseRegex.test(contrasenaValue)) {
            errorMessages.push("* letra mayúscula");
        }
        if (!lowerCaseRegex.test(contrasenaValue)) {
            errorMessages.push("* letra minúscula");
        }
        if (!digitRegex.test(contrasenaValue)) {
            errorMessages.push("* un número");
        }
        if (!specialCharRegex.test(contrasenaValue)) {
            errorMessages.push("* un carácter especial");
        }

        if (errorMessages.length > 0) {
            errorSpan.innerHTML = "La contraseña debe incluir al menos:<br>" + errorMessages.join("<br>");
            errorSpan.style.display = "inline";
        } else {
            errorSpan.style.display = "none";
        }
    }


    function validateCedula() {
        var cedulaInput = document.getElementById("cedula");
        var cedulaValue = cedulaInput.value.trim();
        var cedulaRequiredError = document.getElementById("cedula-required");
        var cedulaInvalidError = document.getElementById("cedula-invalid");

        if (cedulaValue === "") {
            cedulaRequiredError.textContent = "Campo requerido.";
            cedulaRequiredError.style.display = "inline";
            cedulaInvalidError.style.display = "none";
        } else {
            cedulaRequiredError.style.display = "none";
            if (!/^\d{10}$/.test(cedulaValue)) {
                cedulaRequiredError.style.display = "none";
                cedulaInvalidError.textContent = "Por favor, introduce una cédula válida (solo números y 10 dígitos).";
                cedulaInvalidError.style.display = "inline";
            } else {
                cedulaInvalidError.style.display = "none";
            }
        }
    }

    function validateCodigoPostal(input) {
        var codigoPostalValue = input.value.trim();
        var errorSpan = input.nextElementSibling;

        if (codigoPostalValue === "") {
            errorSpan.textContent = "Campo requerido.";
            errorSpan.style.display = "inline";
        } else if (!/^\d+$/.test(codigoPostalValue)) {
            errorSpan.textContent = "El código postal debe contener solo números.";
            errorSpan.style.display = "inline";
        } else {
            errorSpan.style.display = "none";
        }
    }


function checkFormValidity() {
    var inputs = document.querySelectorAll('input[type="text"], select');
    var isValid = true;

    inputs.forEach(function(input) {
        if ((input.value === "" && input.tagName.toLowerCase() !== "select") || input.value === "") {
            isValid = false;
        }

        // Verificar si hay mensajes de error visibles
        var errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.style.display !== "none") {
            isValid = false;
        }
    });

    var registerBtn = document.getElementById("register-btn");
    registerBtn.disabled = !isValid;

    if (isValid) {
        registerBtn.style.opacity = "1"; // Habilitar el botón y establecer la opacidad completa
    } else {
        registerBtn.style.opacity = "0.5"; // Deshabilitar el botón y establecer una opacidad más baja
    }
}
