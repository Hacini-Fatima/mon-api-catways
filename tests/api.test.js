// tests/api.test.js : ce fichier contient les tests automatisés pour l'API REST du projet "Port Russell"

// ============================================================
// CONFIGURATION DE L'ENVIRONNEMENT DE TEST
// ============================================================
// ⚡ IMPORTANT : On force NODE_ENV à 'test' AVANT d'importer l'application.
// Cela permet à app.js de ne pas se connecter à la base de production
// et d'utiliser uniquement la base de test.
process.env.NODE_ENV = 'test';

// Importation des outils de test
const request = require('supertest'); // Simule des requêtes HTTP vers l'API
const mongoose = require('mongoose'); // Pour gérer la connexion à la BDD
const { expect } = require('chai');   // Pour les assertions (expect(...).to.equal(...))
const app = require('../app');        // L'application Express à tester

// Importation des modèles pour manipuler la base de test
const User = require('../models/user');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

// Chargement des variables d'environnement (URL_MONGO, SECRET_KEY...)
require('dotenv').config({ path: './env/.env' });

// ============================================================
// VARIABLES PARTAGÉES ENTRE LES TESTS
// ============================================================
// Ces variables sont déclarées en global pour être utilisées et modifiées
// au fil des tests (ex: on crée un catway au test 1, on le modifie au test 4).
let token = '';
let catwayId = '';
let reservationId = '';

const testEmail = 'test@port-russell.fr';
const testPassword = 'Test1234!';

// ============================================================
// SETUP : Exécuté UNE SEULE FOIS avant tous les tests
// ============================================================
before(async () => {
    // 1. Connexion à la base de données dédiée aux tests ('port-russell-test')
    // Cela évite de supprimer les vraies données de production.
    await mongoose.connect(process.env.URL_MONGO, { dbName: 'port-russell-test' });

    // 2. Nettoyage de la base de test pour partir sur un état "propre"
    // (au cas où des tests précédents auraient échoué et laissé des données)
    await User.deleteMany({});
    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    // 3. Création d'un utilisateur de test et récupération de son token
    // On a besoin d'un token JWT valide pour tester les routes protégées.
    await request(app).post('/users').send({ 
        name: 'Test User', 
        email: testEmail, 
        password: testPassword 
    });
    
    const loginRes = await request(app).post('/users/login').send({ 
        email: testEmail, 
        password: testPassword 
    });
    
    // On stocke le token dans la variable globale pour l'utiliser dans les tests
    token = loginRes.body.token;
});

// ============================================================
// TEARDOWN : Exécuté UNE SEULE FOIS après tous les tests
// ============================================================
after(async () => {
    // Fermeture de la connexion à la base de données pour éviter les fuites de mémoire
    await mongoose.connection.close();
});

// ============================================================
// SUITE DE TESTS : Les 9 fonctionnalités demandées par le client
// ============================================================
describe('API Port Russell - Fonctionnalités Client', () => {

    // --------------------------------------------------------
    // 1. CRÉER UN CATWAY
    // --------------------------------------------------------
    it('1. Créer un catway (POST /api/catways)', async () => {
        // On simule une requête POST avec un token valide
        const res = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`) // Ajout du token JWT
            .send({ catwayNumber: 100, type: 'long', catwayState: 'bon état' });
        
        // Assertions : On vérifie le code HTTP et le contenu de la réponse
        expect(res.status).to.equal(201); // 201 = Created
        expect(res.body).to.have.property('_id'); // La réponse doit contenir un ID
        
        // On sauvegarde l'ID pour les tests suivants
        catwayId = res.body._id; 
    });

    // --------------------------------------------------------
    // 2. LISTER L'ENSEMBLE DES CATWAYS
    // --------------------------------------------------------
    it('2. Lister l\'ensemble des catways (GET /api/catways)', async () => {
        const res = await request(app)
            .get('/api/catways') 
            .set('Authorization', `Bearer ${token}`); 
        
        expect(res.status).to.equal(200); // 200 = OK
        expect(res.body).to.be.an('array'); // La réponse doit être un tableau
    });

    // --------------------------------------------------------
    // 3. RÉCUPÉRER LES DÉTAILS D'UN CATWAY
    // --------------------------------------------------------
    it('3. Récupérer les détails d\'un catway (GET /api/catways/:id)', async () => {
        // On utilise l'ID du catway créé au test 1
        const res = await request(app)
            .get(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).to.equal(200);
        expect(res.body._id).to.equal(catwayId); // L'ID retourné doit correspondre
    });

    // --------------------------------------------------------
    // 4. MODIFIER LA DESCRIPTION DE L'ÉTAT D'UN CATWAY
    // --------------------------------------------------------
    it('4. Modifier la description de l\'état d\'un catway (PATCH /api/catways/:id)', async () => {
        // On envoie uniquement le champ à modifier (PATCH partiel)
        const res = await request(app)
            .patch(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayState: 'En réparation' });
        
        expect(res.status).to.equal(200);
        expect(res.body.catwayState).to.equal('En réparation'); // Vérification de la mise à jour
    });

    // --------------------------------------------------------
    // 5. PRENDRE LA RÉSERVATION D'UN CATWAY
    // --------------------------------------------------------
    it('5. Prendre la réservation d\'un catway (POST /api/catways/:id/reservations)', async () => {
        const res = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientName: 'Jack Sparrow',
                boatName: 'Black Pearl',
                checkIn: '2026-11-01T10:00:00Z', // Date au format ISO
                checkOut: '2026-11-10T10:00:00Z'
            });
        
        expect(res.status).to.equal(201);
        reservationId = res.body._id; // On sauvegarde l'ID pour les tests suivants
    });

    // --------------------------------------------------------
    // 6. LISTER L'ENSEMBLE DES RÉSERVATIONS
    // --------------------------------------------------------
    it('6. Lister l\'ensemble des réservations (GET /api/catways/:id/reservations)', async () => {
        const res = await request(app)
            .get(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0); // Il doit y avoir au moins 1 réservation
    });

    // --------------------------------------------------------
    // 7. AFFICHER LES DÉTAILS D'UNE RÉSERVATION
    // --------------------------------------------------------
    it('7. Afficher les détails d\'une réservation (GET /api/catways/:id/reservations/:idReservation)', async () => {
        const res = await request(app)
            .get(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).to.equal(200);
        expect(res.body._id).to.equal(reservationId);
    });

    // --------------------------------------------------------
    // 8. SUPPRIMER UNE RÉSERVATION
    // --------------------------------------------------------
    it('8. Supprimer une réservation (DELETE /api/catways/:id/reservations/:idReservation)', async () => {
        const res = await request(app)
            .delete(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).to.equal(204); // 204 = No Content (suppression réussie)
    });

    // --------------------------------------------------------
    // 9. SUPPRIMER UN CATWAY
    // --------------------------------------------------------
    it('9. Supprimer un catway (DELETE /api/catways/:id)', async () => {
        const res = await request(app)
            .delete(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).to.equal(204);
    });

});