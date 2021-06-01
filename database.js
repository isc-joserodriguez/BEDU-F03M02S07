require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const mysql = require('mysql2/promise');

let connection;

const connect = async () => {
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });
        console.log('> Conectado a la base de datos');
    } catch (e) {
        console.error('> No se puede establecer la conexión a la BD');
        process.exit(1);
    }
}

const execute = async (query) => {
    const [rows] = await connection.execute(query);
    return rows;
}

module.exports = {
    connect,
    execute
}