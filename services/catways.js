const Catway = require('../models/catway');

// ============================================================
// FONCTIONS MÉTIER PURES
// ============================================================
// ⚠️ RÈGLE : Aucune fonction ici ne reçoit "req" ou "res".
// Aucune fonction ici ne renvoie de code HTTP (res.status).
// Elles font uniquement le lien avec la base de données MongoDB.

async function getAllCatways() {
    // On récupère tous les catways, triés par numéro croissant
    return await Catway.find().sort({ catwayNumber: 1 });
}

async function getCatwayById(id) {
    // On cherche un catway par son ID MongoDB
    return await Catway.findById(id);
}

async function createCatway(data) {
    // On instancie un nouveau catway avec les données reçues
    const newCatway = new Catway(data);
    // On le sauvegarde dans la base
    return await newCatway.save();
}

async function replaceCatway(id, data) {
    // PUT : On remplace TOUT l'objet (overwrite: true)
    return await Catway.findByIdAndUpdate(id, data, {
        new: true,           // Renvoie l'objet modifié (pas l'ancien)
        overwrite: true,     // Remplace intégralement les données
        runValidators: true  // Vérifie que les données respectent le schéma
    });
}

async function updateCatway(id, data) {
    // PATCH : On modifie PARTIELLEMENT l'objet (pas de overwrite)
    return await Catway.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

async function deleteCatway(id) {
    // On supprime définitivement le catway
    return await Catway.findByIdAndDelete(id);
}

// ============================================================
// EXPORTATION
// ============================================================
// On exporte uniquement les fonctions métier. 
// C'est le routeur qui se chargera de les appeler.
module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    replaceCatway,
    updateCatway,
    deleteCatway
};