//? Variables de entorno
require('dotenv').config(); //? Carga variables de .env

const mysql = require('mysql2/promise');

//? Conexiones
const pool = mysql.createPool({ //? Crea el grupo de conexiones utilizables
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool; //? perimite conexión para otros archivos