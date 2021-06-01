const { connect, execute } = require('./database');
const express = require('express');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

connect();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.end('Hello world!');
});

app.get('/productos', async (req, res) => {
    const rows = await execute('SELECT * FROM productos');
    res.json(rows);
})

app.post('/filtrarPorNombre', async (req, res) => {
    const { nombre } = req.body;
    const rows = await execute(`SELECT * FROM productos WHERE nombre LIKE '%${nombre}%'`);
    res.json(rows);
})


app.listen(8080, () => {
    console.log('> Escuchando puerto 8080');
})