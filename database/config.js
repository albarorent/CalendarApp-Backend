const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
       await mongoose.connect(process.env.DB_CNN)
       console.log("Conexión exitosa a la base de datos.");
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la BD')
    }
}

module.exports = {dbConnection}