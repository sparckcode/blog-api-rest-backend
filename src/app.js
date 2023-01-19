const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');

// Mensaje de inicialización.
console.log("App corriendo.");

// Conectar a la BD.
connection();

// Crear servidor Node.
const app = express();
// Puerto.
const port = 3300;

// Configuración de CORS.
app.use(cors());

// Convertir body a JSON.
app.use(express.json());

// Lista de rutas.
app.get('/', (request, response) => {
    return response.status(200).json({
        app: 'blog',
        version: '1.0.0',
        autor: 'Sparck Code'
    });
});

app.get('/test', (request, response) => {
    console.log("Endpoint: test");
    return response.status(200).json(
    [
        {
            curso: 'Master en React',
            autor: 'Marcos Brandon',
            url: 'http://sparckcode.com/cursos/master-react'
        },
        {
            curso: 'Master en React',
            autor: 'Marcos Brandon',
            url: 'http://sparckcode.com/cursos/master-react'
        }
    ]);
});

// Crear servidor y escuchar peticiones HTTP.
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});
