// scripts/seed.js : ce fichier est utilisé pour initialiser la base de données avec des données

require('dotenv').config({ path: './env/.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

const catwaysData = require('../data/catways.json');
const reservationsData = require('../data/reservations.json');

const clientOptions = { dbName: 'port-russell' };

async function seed() {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions);
        console.log('Connecté à MongoDB');

        // Vider les collections
        await Catway.deleteMany({});
        await Reservation.deleteMany({});
        await User.deleteMany({}); // On vide aussi les users pour repartir sur du propre
        console.log('Collections vidées');

        // Insérer les catways
        const catways = await Catway.insertMany(catwaysData);
        console.log(`${catways.length} catways insérés`);

        // Insérer les réservations
        const reservations = await Reservation.insertMany(reservationsData);
        console.log(`${reservations.length} réservations insérées`);

        // Créer l'utilisateur admin
        const hashedPassword = await bcrypt.hash('MotDePasse123', 10);
        await User.create({
            name: 'Admin Capitainerie',
            email: 'admin@port-russell.fr',
            password: hashedPassword
        });
        console.log('✅ Utilisateur admin créé : admin@port-russell.fr / MotDePasse123');

        process.exit(0);
    } catch (err) {
        console.error('Erreur :', err.message);
        process.exit(1);
    }
}
seed();