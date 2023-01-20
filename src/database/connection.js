const mongoose = require('mongoose');

const DB_TYPE       = "mongodb";
const DB_HOST       = "localhost";
const DB_PORT       = '27017';
const DB_NAME       = "my_blog";
const DB_URL        = DB_TYPE + '://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;

const connection = async () => {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL)
    .then(() => {
        console.log('Conexión exitosa a la base de datos: ' + DB_NAME);
    })
    .catch(error => {
        console.log('Error al conectar a la base de datos: ' + error);
    });
}

// Exportar
module.exports = {
    connection
}
