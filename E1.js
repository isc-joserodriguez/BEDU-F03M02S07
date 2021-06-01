const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
console.log( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

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
        console.log('> Error al conectarme a la BD');
        process.exit(1);
    }
}

const executeQuery = async () => {
    const [rows] = await connection.execute('SELECT * FROM prueba_tabla');
    console.log(rows);
}

const main = async () => {
    await connect();
    await executeQuery();
}

main();