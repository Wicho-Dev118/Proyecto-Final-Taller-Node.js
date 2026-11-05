const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Sistema de Administración de Empleados "El Wichardo"');

});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en en http://localhost:${PORT}`);
});