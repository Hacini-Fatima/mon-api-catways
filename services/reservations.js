// services/reservations.js

const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

// ============================================================
// FONCTIONS MÉTIER PURES (Aucun req/res ici)
// ============================================================

// Récupérer TOUTES les réservations (pour la page liste)
async function getAllReservations() {
    // 1. On récupère toutes les réservations triées par date d'arrivée
    const reservations = await Reservation.find().sort({ checkIn: 1 });
    
    // 2. Pour chaque réservation, on cherche l'ID MongoDB du catway parent
    // Cela permet de créer le lien "Voir" vers la page détails.
    const reservationsWithCatway = await Promise.all(reservations.map(async (r) => {
        const catway = await Catway.findOne({ catwayNumber: r.catwayNumber });
        return {
            ...r.toObject(), // Transforme le document Mongoose en objet JS
            catwayId: catway ? catway._id : null // Ajoute l'ID du catway
        };
    }));
    
    return reservationsWithCatway;
}

// Récupérer les réservations d'UN catway spécifique
async function getReservationsByCatway(catwayId) {
    const catway = await Catway.findById(catwayId);
    if (!catway) return null; // Si le catway n'existe pas
    return await Reservation.find({ catwayNumber: catway.catwayNumber }).sort({ checkIn: 1 });
}

// Récupérer UNE réservation spécifique
async function getReservationById(catwayId, reservationId) {
    const catway = await Catway.findById(catwayId);
    if (!catway) return null;
    return await Reservation.findOne({
        _id: reservationId,
        catwayNumber: catway.catwayNumber
    });
}

// Créer une réservation
async function createReservation(catwayId, data) {
    const catway = await Catway.findById(catwayId);
    if (!catway) return null;
    const newReservation = new Reservation({
        ...data,
        catwayNumber: catway.catwayNumber // On force le numéro du catway parent
    });
    return await newReservation.save();
}

// Supprimer une réservation
async function deleteReservation(catwayId, reservationId) {
    const catway = await Catway.findById(catwayId);
    if (!catway) return null;
    return await Reservation.findOneAndDelete({
        _id: reservationId,
        catwayNumber: catway.catwayNumber
    });
}

// ============================================================
// EXPORTATION
// ============================================================
module.exports = {
    getAllReservations, // ⚡ Ajout
    getReservationsByCatway,
    getReservationById,
    createReservation,
    deleteReservation
};