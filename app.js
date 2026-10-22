// ============================================================
// app.js - Configuration de l'application Express
// ============================================================

// 1. Charger dotenv EN PREMIER (chemin absolu)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'env', '.env') });

// 2. Modules
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// 3. Connexion MongoDB
const mongodb = require('./db/mongo');

// On ne connecte pas la BDD de prod si on est en mode test
if (process.env.NODE_ENV !== 'test') {
    mongodb.initClientDbConnection();
}

// 4. Routeurs
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var catwayRouter = require('./routes/catways');
var reservationRouter = require('./routes/reservations');

// 5. Instance Express
var app = express();

// 6. Moteur de template EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 7. CORS
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

// 8. Middlewares globaux
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ⚡ 9. Désactive le cache
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next();
    });
}

// 10. Routes de l'API (pour Postman et le JS du front-end)
app.use('/users', userRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/catways/:id/reservations', reservationRouter);
app.use('/api/catways', catwayRouter);


// 11. Routes des Pages (EJS)
app.use('/', indexRouter); // Gère /, /dashboard, /catways, /reservations, /catway/:id, etc.

// 12. Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 13. Middleware 404
app.use(function(req, res, next) {
    res.status(404).json({
        name: 'API Port Russell',
        version: '1.0',
        status: 404,
        message: 'not found'
    });
});

// 14. Middleware global d'erreurs
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Erreur serveur'
    });
});

// 15. Export
module.exports = app;