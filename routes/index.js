// routes/index.js : ce fichier gère les routes publiques et protégées de l'application

var express = require('express');
var router = express.Router();
const auth = require('../middlewares/private'); // Import du middleware

// ============================================================
// PAGE D'ACCUEIL (Login) - PUBLIQUE
// ============================================================

// Pas de middleware ici, car c'est la page pour se connecter
router.get('/', (req, res) => {
    res.render('index', { title: 'Port Russell - Accueil' });
});

// ============================================================
// PAGE DOCUMENTATION - PUBLIQUE
// ============================================================
// On la laisse publique pour que les correcteurs puissent la lire sans compte
router.get('/documentation', (req, res) => {
    res.render('documentation', { title: 'Documentation API' });
});

// ============================================================
// PAGES PROTÉGÉES (Nécessitent un token valide)
// ============================================================

// Tableau de bord
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', { title: 'Tableau de bord' });
});

// Liste des catways
router.get('/catways', auth, (req, res) => {
    res.render('catways', { title: 'Liste des catways' });
});

// Liste des réservations
router.get('/reservations', auth, (req, res) => {
    res.render('reservations', { title: 'Liste des réservations' });
});

// Détails d'un catway
router.get('/catway/:id', auth, (req, res) => {
    res.render('catway', { 
        title: 'Détails du catway',
        catwayId: req.params.id 
    });
});

// Détails d'une réservation
router.get('/reservation/:catwayId/:reservationId', auth, (req, res) => {
    res.render('reservation', { 
        title: 'Détails de la réservation',
        catwayId: req.params.catwayId,
        reservationId: req.params.reservationId
    });
});

module.exports = router;