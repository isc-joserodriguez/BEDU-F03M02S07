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
});

app.post('/filtrarPorNombre', async (req, res) => {
    const { nombre } = req.body;
    const rows = await execute("SELECT * FROM productos WHERE nombre LIKE CONCAT('%',?,'%')", [nombre]);
    res.json(rows);
});

app.get('/filtrarPorPrecio', async (req, res) => {
    let { max, min } = req.query;
    min = +min || -1;
    max = +max || -1;
    let rows = [];

    if (min >= 0 && max >= 0) {
        rows = await execute(`SELECT * FROM productos WHERE precio >= ? AND precio <= ?`, [min, max]);
    } else if (min >= 0) {
        rows = await execute(`SELECT * FROM productos WHERE precio >= ?`, [min]);
    } else if (max >= 0) {
        rows = await execute(`SELECT * FROM productos WHERE precio <= ?`, [max]);
    }

    res.json(rows);
})

app.post('/agregarProducto', async (req, res) => {
    const { nombre, precio } = req.body;

    await execute(`INSERT INTO productos VALUES (0,?,?)`, [nombre, precio]);
     res.send('Producto Agregado');
})

app.delete('/eliminarProducto/:id', async (req, res) => {
    const { id } = req.params;

    await execute(`DELETE FROM productos WHERE id = ?`, [id]);
    
    res.send('Producto eliminado');
})


app.listen(8080, () => {
    console.log('> Escuchando puerto 8080');
})