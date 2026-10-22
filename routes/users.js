// routes/users.js : ce fichier gère les routes liées aux utilisateurs (inscription, connexion, gestion du profil)

var express = require('express');
var router = express.Router();
const userService = require('../services/users');
const auth = require('../middlewares/private');

// ============================================================
// ROUTES PUBLIQUES
// ============================================================

// POST /users - Inscription
router.post('/', async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        // Gestion spécifique du conflit d'email (409)
        if (err.message.includes('déjà utilisé')) {
            return res.status(409).json({ message: err.message });
        }
        next(err);
    }
});

// POST /users/login - Connexion
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.login(email, password);
        
        // On renvoie le token et les infos basiques (sans le mot de passe)
        res.status(200).json({
            user: { _id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        // Si le login échoue, on renvoie une 401 (Non autorisé)
        res.status(401).json({ message: err.message });
    }
});

// ============================================================
// ROUTES PROTÉGÉES
// ============================================================

// GET /users/profile/me - Route de test pour voir si le JWT fonctionne
router.get('/profile/me', auth, (req, res) => {
    // req.user est injecté par le middleware auth
    res.json({ message: 'Tu es authentifié !', user: req.user });
});

// GET /users - Lister les utilisateurs
router.get('/', auth, async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) { next(err); }
});

// GET /users/:id
router.get('/:id', auth, async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    } catch (err) { next(err); }
});

// PUT /users/:id
router.put('/:id', auth, async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    } catch (err) { next(err); }
});

// DELETE /users/:id
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(204).send();
    } catch (err) { next(err); }
});

module.exports = router;