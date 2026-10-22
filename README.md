# 🌊 API Port de Plaisance Russell

API REST sécurisée pour la gestion des réservations de catways du Port de Plaisance Russell.

## 🚀 Stack Technique
- **Backend** : Node.js, Express
- **Base de données** : MongoDB, Mongoose
- **Frontend** : EJS, HTML/CSS/JS Vanilla
- **Sécurité** : JWT (JSON Web Tokens), bcryptjs
- **Documentation** : Swagger UI & JSDoc
- **Tests** : Mocha, Chai, Supertest

## 📦 Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/VOTRE_NOM/mon-api-catways.git
   cd mon-api-catways

# Import des données

## Méthode 1 : mongoimport (recommandée, cf. brief)
mongoimport --uri "..." --collection catways --file data/catways.json --jsonArray
mongoimport --uri "..." --collection reservations --file data/reservations.json --jsonArray

## Méthode 2 : Script de seed (alternative)
node scripts/seed.js


# Documentation API

- `swagger.js` : configuration Swagger
- `users.yaml` : annotations Users
- `catways.yaml` : annotations Catways
- `reservations.yaml` : annotations Reservations

## Voir la doc

Démarrer le serveur, puis : http://localhost:3000/api-docs