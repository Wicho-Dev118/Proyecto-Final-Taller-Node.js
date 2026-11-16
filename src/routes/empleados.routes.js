const express = require('express');
const pool = require('../config/db');
const verificarToken = require('../middleware/auth.middleware');
const router = express.Router();


//? Consultar todos los empleados
router.get('/', verificarToken, async (req, res) =>{
    try {
        const [empleados] = await pool.query(
            'SELECT * FROM empleados'
        );
    
        res.json({
            mensaje: 'Empleados obtenidos correctamente',
            empleados: empleados
        });
    } catch (error) {
        console.error('Error al consultar empleados:', error);

        res.status(500).json({
            mensaje: 'Error al consultar los empleados'
        });
    }
});

//? Ruta de protegida
router.get('/prueba', verificarToken,(req, res) => {
    res.json({
        mensaje: 'Acceso Concedido (-■_■). Middleware funcinando correctamente',
        administrador: req.administrador
    });
});

//? Agregar un empleado
router.post('/', verificarToken, async (req, res) =>{
    try{
        //* Recibir datos del empleado
        const {nombre, apellidos, telefono, correo, direccion} = req.body;

        //* Comprobar datos obligatorios
        if (!nombre || !apellidos) {
            return res.status(400).json({
                mensaje: '(-■_■) El nombre y los apellidos son obligatorios'
            });
        }

        //? Insertar empleado en la base de datos
        const [resultado] = await pool.query(
            `INSERT INTO empleados
            (nombre, apellidos, telefono, correo, direccion)
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, apellidos, telefono, correo, direccion]
        );

        res.status(201).json({
            mensaje: 'Empleado agregado correctamente',
            empleado: {
                id: resultado.insertId,
                nombre,
                apellidos,
                telefono,
                correo,
                direccion
            }
        });

    } catch (error) {
        console.error('(X-X) Error al agregar empleado:', error);

        res.status(500).json({
            mensaje: '(X-X) Error al agregar el empleado'
        });
    }
});

//? Modificar un empleado 
router.put('/:id', verificarToken, async (req, res) => {
    try{
        //* Obtener el id
        const{id} = req.params;

        //* Recibir nuevos datos
        const{nombre, apellidos ,telefono, correo, direccion} = req.body;

        //* Comprobar el id
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                mensaje:  '(X-X) El id del empleado es inválido'
            });
        }

        //* Comprobar los campos
        if (!nombre || !apellidos) {
            return res.status(400).json({
                mensaje: '(X-X) El nombre y los paellidos son obligatorios'
            });
        }
        
        //* Comprobar que el empleado exista
        const [empleados] = await pool.query(
            'SELECT id FROM empleados WHERE id = ?',
            [id]
        );

        if(empleados.length === 0) {
            return res.status(404).json({
                mensaje: '(X-X) No se encontro el empleado'
            });
        }

        await pool.query(
            `UPDATE empleados
            SET nombre = ?, apellidos = ?, telefono = ?, correo = ?, direccion = ?
            WHERE id = ?`,
            [nombre, apellidos, telefono, correo, direccion, id]
        );

        //* Obtener daros actualizados
        const [empleadosActualizados] = await pool.query(
            'SELECT * FROM empleados WHERE id = ?',
            [id]
        );

        res.json({
            mensaje: '(-■_■) Empleado actualizado correctamente',
            empleados: empleadosActualizados[0]
        });
    } catch (error) {
        console.error('(X-X) Error al modificar empleado:', error);

        res.status(500).json({
            mensaje: '(X-X) Error al modificar el empleado'
        });
    }
});

//? Elimnar un empleado por su id
router.delete('/:id', verificarToken, async (req, res) => {
    try{
        //* obtener el id
        const {id} = req.params;

        //* Comprobar que el id es válido
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                    mensaje: '(X-X) El id del empleado no es válido'
                });
            }

            //* Comprobar que el empleado exista
            const [empleados] = await pool.query(
                'SELECT id FROM empleados WHERE id = ?',
                [id]
            );

            if (empleados.length === 0) {
                return res.status(404).json({
                    mensaje: '(X-X) No se encontró el empleado'
                });
        }

        //* Elminar empleado
        await pool.query(
            'DELETE FROM empleados WHERE id = ?',
            [id]
        );

        res.json({
            mensaje: '(-■_■) Empleado eliminado correctamente',
            id: Number(id)
        });
        

    } catch (error) {
        console.error('(X-X) Error al eliminar empleado', error)

        res.status(500).json({
            mensaje: '(X-X) Error al eliminar el empleado'
        });
    }
});

//? Buscar empleados por nombre
router.get('/buscar', verificarToken, async (req, res) => {
    try {
        //* obtener el nombre
        const {nombre} = req.query;

        //* Comprobar el campo
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                mensaje: '(X-X) Debes proporcionar un nombre para la búsqueda'
            });
        }

        //* Buscar conincidencias en la base de datos
        const [empleados] = await pool.query(
            'SELECT * FROM empleados WHERE nombre LIKE ?',
            [`%${nombre.trim()}%`] //? %para cualquier número de caracteres y .trim para evitar espacios
        );

        //* Comprobar que existe
        if (empleados.length === 0) {
            return res.status(404).json({
                mensaje: '(X-X) No se encontraron empleados con ese nombre'
            });
        }

        res.json({
            mensaje: '(-■_■) Empleado encontrado',
            resultados: empleados.length,
            empleados: empleados
        });
    
    } catch (error) {
        console.error('(X-X) Error al buscar empleado: ', error);

        res.status(500).json({
            mensaje: '(X-X) Error al realizar la búsqueda'
        });
    }
});
module.exports = router;
