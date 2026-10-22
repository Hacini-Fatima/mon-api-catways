// db/mongo.js : ce fichier contient la logique de connexion à MongoDB via Mongoose

const mongoose = require('mongoose');

exports.initClientDbConnection = async () => {
    try {
        // Si on est en test, on utilise une base séparée
        const dbName = process.env.NODE_ENV === 'test' ? 'port-russell-test' : 'port-russell';
        
        const clientOptions = { dbName: dbName };
        
        await mongoose.connect(process.env.URL_MONGO, clientOptions);
        console.log(`MongoDB connecté à la base : ${dbName}`);
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        throw error;
    }
};