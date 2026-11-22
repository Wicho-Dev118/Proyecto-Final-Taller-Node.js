const logiForm = document.getElementById('login-form');
const mensajeError = document.getElementById('mensaje-error');

//? recibir formulario
logiForm.addEventListener('submit', async (event) => {

    //? para que no se recargue el navegador
    event.preventDefault();

    //? obtener los datos ingresados
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    //? limpiar mensajes anteriores
    mensajeError.textContent = '';

    try {
        //? enviar solicitud al backend
        const respuesta = await fetch('/api/auth/login', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        //? Recibir respuesta
        const datos = await respuesta.json();

        //? Comprobar si el inicio de sesión fue correcto
        if (!respuesta.ok) {
            mensajeError.textContent = datos.mensaje;
            return;
        }

        //? Guardar token
        sessionStorage.setItem('token', datos.token);

        //? Guardar los datos de admin
        sessionStorage.setItem(
            'administrador',
            JSON.stringify(datos.administrador)
        );

        //? Rederigir al poner de admin
        window.location.href = '/empleados.html';
    
    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        mensajeError.textContent = '(X-X) No fue posible conectar con el servidor';
    } 
});