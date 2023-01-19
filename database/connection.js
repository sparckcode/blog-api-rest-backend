const mongoose = require('mongoose');

const DB_TYPE       = "mongodb+srv";
const DB_HOST       = "localhost";
const DB_NAME       = "my_blog";
const DB_USERNAME   = "sparck";
const DB_PASSWORD   = "Sparck07";

const connection = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(`${DB_TYPE}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?authMechanism=DEFAULT`,
            () => {
                console.log(`Conexión exitosa a la base de datos: ${DB_NAME}`);
            }
        );
    } catch (error) {
        throw new Error(`Error al conectar a la base de datos: ${error}`);
    }
}

// Exportar
module.exports = {
    connection
}
