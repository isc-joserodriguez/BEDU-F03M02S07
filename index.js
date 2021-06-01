require("dotenv").config();

/**
 * Un API REST es un API que cumple con diversas
 * caracteristicas.
 *
 * El concepto de REST es una serie de "recomendaciones".
 *
 * 1. Las consultas deben de estar auto-contenidas. (IMPORTANTE)
 *
 * 2. Apoyarse los verbos/métodos de HTTP para expresar operaciones.
 *
 *  GET - Obtener información
 *  POST - Crear información
 *  PUT - Reemplazar información
 *  PATCH - Actualizar información
 *  DELETE - Eliminar información
 *
 *
 * 3. Para el nombrado de rutas, utilizar PRONOMBRES y no verbos
 * (de preferencia en plural)
 *
 *  /productos
 *
 * 4. Expresar las relaciones de la información a través del nombrado
 * de las rutas
 *
 *  GET /publicaciones: Obtiene todas las publicaciones
 *  GET /comentarios: Obtiene todos los comentarios
 *
 *  Relacion:
 *
 *    Publicaciones tienen comentarios
 *
 *
 *  GET /publicaciones/:id/comentarios: Obtiene todos los comentarios
 * de una publicación en particular
 *
 *  GET /programas/:id/modulos/:id/sesiones
 *
 * 5. Utilizar querystring para filtrar información
 * Utilizar body para enviar datos
 * Utilizar params para enviar identificadores
 * Utilizar headers para enviar datos adicionales
 *
 *
 * 6. Utilizar los códigos de status de HTTP
 *
 * Éxito:
 *  200 - Ok
 *  201 - Created
 *
 * Error:
 *  400 - Bad Request
 *  401 - Unauthorized
 *  403 - Forbidden
 *  404 - Not Found
 *  500 - Internal Server Error
 *
 * 7. Utilizar JSON para la comunicación
 */

const { connect, execute } = require("./database");
const express = require("express");

connect();

const app = express();

app.use(express.json());

app.get("/", function (request, response) {
    response.end("Hello World REST");
});

// 1. Obtener la lista de todos los productos
app.get("/productos", async function (request, response) {
    if (request.query.nombre) {
        const { nombre } = request.query;
        const rows = await execute(
            "SELECT * FROM productos WHERE nombre LIKE CONCAT('%', ?, '%')",
            [nombre]
        );
        response.json(rows);
    } else if (request.query.minimo || request.query.maximo) {
        let { maximo, minimo } = request.query;

        minimo = parseInt(minimo) || -1;
        maximo = parseInt(maximo) || -1;

        let rows = [];

        if (minimo >= 0 && maximo >= 0) {
            rows = await execute(
                "SELECT * FROM productos WHERE precio >= ? AND precio <= ?",
                [minimo, maximo]
            );
        } else if (minimo >= 0 && maximo < 0) {
            rows = await execute("SELECT * FROM productos WHERE precio >= ?", [
                minimo
            ]);
        } else if (minimo < 0 && maximo > 0) {
            rows = await execute("SELECT * FROM productos WHERE precio <= ?", [
                maximo
            ]);
        }

        response.json(rows);
    } else {
        const rows = await execute("SELECT * FROM productos");
        response.json(rows);
    }
});

// 4. Agregar un nuevo producto
app.post("/productos", async function (request, response) {
    const { nombre, precio } = request.body;

    if (!nombre || !precio) {
        response.status(400).json({
            error: "Parámetros incompletos"
        });
        return;
    }

    await execute("INSERT INTO productos VALUES (0, ?, ?)", [nombre, precio]);

    response.status(201).json({ ok: true });
});

// 5. Eliminar un producto
app.delete("/productos/:id", async function (request, response) {
    const { id } = request.params;

    await execute("DELETE FROM productos WHERE id = ?", [id]);

    response.json({ ok: true });
});

app.listen(8080, function () {
    console.log("> Escuchando puerto 8080");
});
