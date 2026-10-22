// Middleware pour vérifier le token JWT dans les requêtes privées (API et pages)
// Si le token est valide, on ajoute les infos de l'utilisateur à req.user

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = null;

        // 1. On cherche le token dans le header Authorization (pour l'API)
        const authHeader = req.headers.authorization;
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }

        // 2. Si pas de token dans le header, on cherche dans les cookies (pour les pages)
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // 3. Si aucun token n'est trouvé
        if (!token) {
            // Si c'est une requête API (commence par /api), on renvoie du JSON
            if (req.originalUrl.startsWith('/api/')) {
                return res.status(401).json({ message: 'Token manquant' });
            }
            // Si c'est une page, on redirige vers la page de login
            return res.redirect('/');
        }

        // 4. On vérifie le token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        // Si le token est invalide
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
        return res.redirect('/');
    }
};