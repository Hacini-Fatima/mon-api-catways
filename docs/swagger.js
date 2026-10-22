const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Port Russell API',
            version: '1.0.0',
            description: 'API de gestion des réservations de catways du Port de Plaisance Russell'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Développement' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    // ⚡ On liste les fichiers un par un pour être sûr à 100% qu'ils sont lus
    apis: [
        path.join(__dirname, 'users.yaml'),
        path.join(__dirname, 'catways.yaml'),
        path.join(__dirname, 'reservations.yaml')
    ]
};

module.exports = swaggerJsdoc(options);