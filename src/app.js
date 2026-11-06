const express = require('express');
const app = express();
const PORT = 3000;

//? Importar rutas
const authRoutes = require('./routes/auth.routes');
const empleadosRoutes = require('./routes/empleados.routes');

//? Middlewares
app.use(express.json());


//? Ruta principal
app.get('/', (req, res) => {
    res.send('Sistema de Administración de Empleados "El Wichardo"');

});

//? Registrar rutas
app.use('/apli/auth', authRoutes);
app.use('/api/empleados', empleadosRoutes);



//? Ruta prueba para recibir JSON
app.post('/prueba', (req, res) => {
    const datos = req.body;

    console.log(datos);

    res.json({
        mensaje: 'Información recibida correctamente (-■_■)',
        datos: datos
    });
});


//? Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en en http://localhost:${PORT}`);
});