const jwt = require('jsonwebtoken');

//? Middleware para verificar la autenticación
const verficarToken = (req, res, next) => {
    
    //? Obtener enabezado
    const authHeader = req.headers.authorization;

    //? Comprobar si existe 
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'Acceso denegado (X-X), ingresa un token'
        });
    }

    //? Extraer el token
    const token = authHeader.split(' ')[1];

    try {
        //? Verificar el token
        const administrador = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //? Guardar los datos
        req.administrador = administrador;

        next(); //? Continua con la solicitud
    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

module.exports = verficarToken;