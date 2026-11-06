const express = require('express');
const { route } = require('./empleados.routes');
const router = express.Router();

//? Ruta de prueba para autenticación
router.post('/login', (req, res) => {
    res.json({
        mensaje: 'Ruta de inicio de sesión funcionando correctamente'
    });
});

module.exports = router;
