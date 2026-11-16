const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { route } = require('./empleados.routes');
const router = express.Router();

//? Ruta incio de sesión
router.post('/login', async (req, res) => {
    try {
        //? Recibe el usuario y la contraseña
        const{usuario,password} = req.body;

        //? Comprueba usuario y contraseña
        if (!usuario || !password) {
            return res.status(400).json({
                mensaje: 'Debes proporcionar usuario y contraseña'
            });
        }

        //? Buscar al administrador en la base de datos
        const [administradores] = await pool.query(
            'SELECT id, usuario, password FROM administradores WHERE usuario = ? LIMIT 1',
            [usuario]
        );

        //? Comprobar que existe el administrador
        if (administradores.length === 0) {
            return res.status(401).json({
                mensaje: 'Datos incorrectos'
            });
        }

        const administrador = administradores[0];

        //? Comparar la contraseña con el hash
        const passwordValida = await bcrypt.compare(
            password,
            administrador.password
        );

        if(!passwordValida) {
            return res.status(401).json({
                mensaje: 'Datos incorrectos'
            });
        }

        //? Generar token 
        const token = jwt.sign(
            {
                id: administrador.id,
                usuario: administrador.usuario
            },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    res.json({
        mensaje: 'Inicio de sesión exitoso',
        token: token,
        administrador: {
            id: administrador.id,
            usuario: administrador.usuario
        }
    });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

module.exports = router;