//! Autenticación

//? obtener tolen alamcenados
const token = sessionStorage.getItem('token');

//? Comprobar si existe una sesión
if (!token) {

    //? Rederigir al login si no existe token
    window.location.href = '/';
}

//! Elementos de html

const listaEmpleados = document.getElementById('lista-empleados');
const mensajeTabla = document.getElementById('mensaje-tabla');

//? Elementos de buscador
const campoBusqueda = document.getElementById('buscar-empleado');
const btnBuscar = document.getElementById('btn-buscar');
const btnMostrarTodos = document.getElementById('btn-mostrar-todos');

//? Elemento de agregar empleados
const modalEmpleado = document.getElementById('modal-empleado');
const btnAgregar = document.getElementById('btn-agregar');
const btnCancelar = document.getElementById('btn-cancelar');

//? Formulario de empleado
const formEmpleado = document.getElementById('form-empleado');
const mensajeFormulario = document.getElementById('mensaje-formulario');
const btnGuardar = document.getElementById('btn-guardar');
const btnCerrarSesion = document.getElementById('cerrar-sesion');
let empleadoEditandoId = null;


//? Obetner dados del formulario
function obtenerDatosFormulario() {
    return{
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
    };
}

//! Editar Empleado
function editarEmpleado(empleado) {
    empleadoEditandoId = empleado.id;

    document.getElementById('nombre').value = empleado.nombre;
    document.getElementById('apellidos').value = empleado.apellidos;
    document.getElementById('telefono').value = empleado.telefono ?? '';
    document.getElementById('correo').value = empleado.correo ?? '';
    document.getElementById('direccion').value = empleado.direccion ?? '';
        
    document.querySelector('#modal-empleado h2').textContent = 'Editar empleado';
    btnGuardar.textContent = 'Actualizar empleado';

    mensajeFormulario.textContent = '';

    modalEmpleado.classList.add('active');
}

//! Guardar Empleado
async function guardarEmpleado() {
    const empleado = obtenerDatosFormulario();

    btnGuardar.disabled = true;
    btnGuardar.textContent =  empleadoEditandoId ? '(-■_■) Actualizando...' : '(-■_■) Guardando...';

    try {
        const respuesta = await fetch(
            empleadoEditandoId
                ? `/api/empleados/${empleadoEditandoId}`
                : '/api/empleados',
            {
                method: empleadoEditandoId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(empleado)
            }
        );

        const datos = await respuesta.json();

        if (respuesta.status === 401) {
            sessionStorage.clear();
            window.location.href = "/";
            return;
        }

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || '(X-X) No fue posible registrar al empleado');
        }

        modalEmpleado.classList.remove('active');
        formEmpleado.reset();

        empleadoEditandoId = null;
        document.querySelector('#modal-empleado h2').textContent = 'Agregar empleado';

        await cargarEmpleados();

        mensajeTabla.textContent = datos.mensaje || '(-■_■) Empleado guardado correctamente';

    } catch (error) {
        console.error('(X-X) Error al guardar empleado', error);
        mensajeFormulario.textContent = error.message;
    
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar empleado';
    }
}

//! Eliminar empleado
async function  eliminarEmpleado(id) {
    const confirmar = confirm('(-■_■) ¿Estás seguro de eliminar este empleado?');

    if (!confirmar) return;
    try {
        const respuesta = await fetch(`/api/empleados/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const datos = await respuesta.json();

        if (respuesta.status === 401) {
            sessionStorage.clear();
            window.location.href = '/';
            return;
        }

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || '(X-X) No fue posible eliminar al empleado');
        }

        await cargarEmpleados();

        mensajeTabla.textContent = datos.mensaje || '(-■_■) Empleado elinado correctamente';
    
    } catch (error) {
        console.error('(X-X) Error al eliminar empleado:', error);
        mensajeTabla.textContent = error.message;
    }
    
}

//! Obtener empleados
async function cargarEmpleados() {

    //? Mostrar mensaje de carga
    mensajeTabla.textContent = '(-■_■) Cargando empleados...';

    try {

        //? Solicitar los empleados al servidor
        const respuesta = await fetch('/api/empleados', {
            method: 'GET',

            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        //? Comprobar si el token fue rechazado
        if (respuesta.status === 401) {

            sessionStorage.clear();
            window.location.href = '/';
            return;

        }

        //? Obtener los datos de la respuesta
        const empleados = await respuesta.json();

        //? Comprobar si la respuesta fue exitosa
        if (!respuesta.ok) {
            throw new Error(empleados.mensaje || '(X_X) Error al obtener empleados');
        }

        //? Mostrar los empleados en la tabla
        mostrarEmpleados(empleados.empleados);

    } catch (error) {

        console.error('(X_X) Error al cargar empleados:', error);

        mensajeTabla.textContent =
            '(X_X) No fue posible cargar los empleados.';

    }
}

//! Mostrar empleados
function mostrarEmpleados(empleados) {

    //? Limpiar la tabla
    listaEmpleados.innerHTML = '';

    //? Comprobar si existen empleados
    if (empleados.length === 0) {

        mensajeTabla.textContent = '(-■_■) No hay empleados registrados.';
        return;

    }

    //* Limpiar mensaje
    mensajeTabla.textContent = '';

    //? Recorrer los empleados
    empleados.forEach(empleado => {

        //? Crear una fila
        const fila = document.createElement('tr');

        //? Crear las celdas
        const datos = [
            empleado.id,
            empleado.nombre,
            empleado.apellidos,
            empleado.telefono,
            empleado.correo,
            empleado.direccion
        ];

        //? Crear una celda
        datos.forEach(dato => {

            const celda = document.createElement('td');

            celda.textContent = dato ?? '';

            fila.appendChild(celda);

        });

        //? Crear la celda de acciones
        const celdaAcciones = document.createElement('td');
        
        //* Botón editar
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-editar');

        btnEditar.addEventListener('click', () => {
            editarEmpleado(empleado);
        });

        //* Botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eleminar');

        btnEliminar.addEventListener('click', () => {
            eliminarEmpleado(empleado.id);
        });

        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
        

        //? Añadir la celda a la fila
        fila.appendChild(celdaAcciones);

        //? Añadir la fila a la tabla
        listaEmpleados.appendChild(fila);

    });
}

//! Buscador de empleados
async function buscarEmpleados() {

    //? Obtener el nombre ingresado
    const nombre = campoBusqueda.value.trim();

    //? Comprobar si el campo está vacío
    if (!nombre) {

        mensajeTabla.textContent =
            '(-■_■) Ingresa un nombre para realizar la búsqueda';
        return;

    }

    //? Mostrar mensaje
    mensajeTabla.textContent = ' (-■_■)Buscando empleados...';

    try {

        //? Solicitar la búsqueda
        const respuesta = await fetch(
            `/api/empleados/buscar?nombre=${encodeURIComponent(nombre)}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        //? Comprobar si el token fue rechazado
        if (respuesta.status === 401) {

            sessionStorage.clear();
            window.location.href = '/';
            return;

        }

        //? Obtener los datos
        const datos = await respuesta.json();

        //? Comprobar si la respuesta es correcta
        if (!respuesta.ok) {

            listaEmpleados.innerHTML = '';

            mensajeTabla.textContent =
                datos.mensaje || '(X-X) No fue posible realizar la búsqueda.';

            return;

        }

        //? Mostrar los resultados
        mostrarEmpleados(datos.empleados);

    } catch (error) {

        console.error('(X-X) Error al buscar empleados:', error);

        mensajeTabla.textContent =
            '(X-X) No fue posible realizar la búsqueda.';

    }

}


btnBuscar.addEventListener('click', buscarEmpleados);

//! Botón mostrar todos
btnMostrarTodos.addEventListener('click', () => {

    campoBusqueda.value = '';
    cargarEmpleados();

});

//! Buscar al presionar enter
campoBusqueda.addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
        buscarEmpleados();
    }

});

//! Abrir modal
btnAgregar.addEventListener('click', () => {
    modalEmpleado.classList.add('active');
});


btnCancelar.addEventListener('click', () => {

    modalEmpleado.classList.remove('active');
    formEmpleado.reset();

    empleadoEditandoId = null;
    document.querySelector('#modal-empleado h2').textContent = 'Agregar empleado';
    btnGuardar.textContent = 'Guardar empleado';
    mensajeFormulario.textContent = '';
});

formEmpleado.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensajeFormulario.textContent = '';
    await guardarEmpleado();
});

btnCerrarSesion.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/';
});

cargarEmpleados();
