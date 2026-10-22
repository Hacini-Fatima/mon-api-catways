// routes/catways.js : ce fichier gère les routes liées aux catways (CRUD)

var express = require('express');
var router = express.Router();
const catwayService = require('../services/catways');
const auth = require('../middlewares/private');

// ============================================================
// MIDDLEWARE DE SÉCURITÉ
// ============================================================
// On applique la vérification du token JWT à TOUTES les routes de ce fichier
router.use(auth);

// ============================================================
// ROUTES CRUD
// ============================================================
// ⚠️ RÈGLE : C'est ICI (et seulement ici) qu'on gère :
// - La récupération des données depuis req (req.params, req.body)
// - L'envoi de la réponse avec res (res.status, res.json)
// - Le passage au gestionnaire d'erreurs (next)

// GET /catways - Lister tous les catways
router.get('/', async (req, res, next) => {
    try {
        // Appel au service métier (sans lui passer req)
        const catways = await catwayService.getAllCatways();
        // Gestion du code HTTP 200 (Succès)
        res.status(200).json(catways);
    } catch (err) {
        // En cas d'erreur, on passe la main au middleware d'erreurs d'Express
        next(err);
    }
});

// GET /catways/:id - Récupérer un catway par son ID
router.get('/:id', async (req, res, next) => {
    try {
        // On extrait l'ID de l'URL et on le passe au service
        const catway = await catwayService.getCatwayById(req.params.id);
        
        // Gestion du code HTTP 404 (Non trouvé)
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        res.status(200).json(catway);
    } catch (err) {
        next(err);
    }
});

// POST /catways - Créer un catway
router.post('/', async (req, res, next) => {
    try {
        // On passe le corps de la requête (req.body) au service
        const newCatway = await catwayService.createCatway(req.body);
        // Gestion du code HTTP 201 (Créé)
        res.status(201).json(newCatway);
    } catch (err) {
        next(err);
    }
});

// PUT /catways/:id - Remplacer un catway
router.put('/:id', async (req, res, next) => {
    try {
        const updated = await catwayService.replaceCatway(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
});

// PATCH /catways/:id - Modifier partiellement un catway
router.patch('/:id', async (req, res, next) => {
    try {
        const updated = await catwayService.updateCatway(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
});

// DELETE /catways/:id - Supprimer un catway
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await catwayService.deleteCatway(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        
        // Gestion du code HTTP 204 (Pas de contenu, suppression réussie)
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;