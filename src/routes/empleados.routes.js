const express = require('express');
const router = express.Router();

//? Ruta de prueba
router.get('/prueba', (req, res) => {
    res.json({
        mensaje: 'Rutas de empleados funcionando correctamente'
    });
});

module.exports = router;
