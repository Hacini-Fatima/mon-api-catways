// routes/reservations.js

var express = require('express');
// mergeParams: true permet de récupérer :id depuis la route parente /api/catways/:id/reservations
var router = express.Router({ mergeParams: true }); 
const reservationService = require('../services/reservations');
const auth = require('../middlewares/private');

// Protection de toutes les routes
router.use(auth);

// ============================================================
// ROUTE GLOBALE (Pour lister TOUTES les réservations - page /reservations)
// Doit être déclarée AVANT /:idReservation
// ============================================================
router.get('/all', async (req, res, next) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.status(200).json(reservations);
    } catch (err) {
        next(err);
    }
});

// ============================================================
// ROUTES SPÉCIFIQUES À UN CATWAY
// ============================================================

// GET /api/catways/:id/reservations - Lister les réservations d'un catway
router.get('/', async (req, res, next) => {
    try {
        // Sécurité : si l'ID du catway n'est pas fourni
        if (!req.params.id) {
            return res.status(400).json({ message: 'ID du catway manquant' });
        }
        
        const reservations = await reservationService.getReservationsByCatway(req.params.id);
        
        if (reservations === null) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        res.status(200).json(reservations);
    } catch (err) {
        next(err);
    }
});

// GET /api/catways/:id/reservations/:idReservation - Détails d'une réservation
router.get('/:idReservation', async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'ID du catway manquant' });
        }

        const reservation = await reservationService.getReservationById(
            req.params.id, 
            req.params.idReservation
        );
        
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
});

// POST /api/catways/:id/reservations - Créer une réservation
router.post('/', async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'ID du catway manquant' });
        }

        const newReservation = await reservationService.createReservation(req.params.id, req.body);
        
        if (!newReservation) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        res.status(201).json(newReservation);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/catways/:id/reservations/:idReservation - Supprimer une réservation
router.delete('/:idReservation', async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'ID du catway manquant' });
        }

        const deleted = await reservationService.deleteReservation(
            req.params.id, 
            req.params.idReservation
        );
        
        if (!deleted) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;