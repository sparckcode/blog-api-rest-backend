const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');

const ArticleRoutes = require('./api/routes/ArticleRoute');

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

// Recibir datos con content-type app/json
app.use(express.json());
// Recibir datos de x-www-form-encode.
app.use(express.urlencoded({
    extended: true
}))

// Lista de rutas.
app.use('/api', ArticleRoutes);

// Crear servidor y escuchar peticiones HTTP.
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});
