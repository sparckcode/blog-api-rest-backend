const { connection } = require('./database/connection');

// Mensaje de inicialización.
console.log("App corriendo.");

// Conectar a la BD.
connection();