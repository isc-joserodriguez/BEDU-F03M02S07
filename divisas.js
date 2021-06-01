const divisas = require('./divisas.json');

const express = require('express');

const app = express();


app.use(express.json());

app.get('/', function (request, response) {
    response.end('Hello BEDU');
});

app.get('/divisas', function (request, response) {
    const catalogo = divisas.map(divisa => divisa.moneda);
    response.status(200).json(catalogo);
});
console.log(divisas)

app.get('/divisas', function (request, response) {
    const { moneda, monedaA, monedaB } = request.query;
    let valores = [];
    if (!!moneda) {
        valores = divisas.filter(divisa => divisa.moneda == moneda);
        if (valores.length) {
            response.status(200).json(valores[0].tipoCambio);
        } else {
            response.status(404).json({ error: 'No existe esa moneda' });
        }
    } else if (!!monedaA && !!monedaB) {
        let valores = divisas.filter(divisa => divisa.moneda == monedaA);

        if (valores.length) {
            const cambio = valores[0].tipoCambio.filter(divisa => divisa.moneda == monedaB);
            if (cambio.length) {
                response.status(200).json({ ok: `1 ${monedaA} vale ${cambio[0].valor}` });
            } else {
                response.status(404).json({ error: `No existe el cambio de ${monedaA} a ${monedaB}` });
            }
        } else {
            response.status(404).json({ error: `No existe el cambio de ${monedaA}` });
        }
    } else {
        response.status(404).json({ error: 'Parámetros erroneos' });
    }
});


app.listen(8080, function () {
    console.log('> Servidor escuchando el puerto 8080');
});