// public/javascripts/reservation.js

// 1. Vérification de l'authentification
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
}

// 2. Récupération des DEUX IDs depuis l'URL (car on ne peut pas utiliser EJS ici)
const pathParts = window.location.pathname.split('/');
const reservationId = pathParts.pop(); // ex: "65f1a2c4..."
const catwayId = pathParts.pop();      // ex: "65f1a2b3..."

const container = document.getElementById('detailsContainer');
const errorMsg = document.getElementById('errorMessage');

// 3. Fonction pour charger les détails
async function loadReservationDetails() {
    try {
        const res = await fetch(`/api/catways/${catwayId}/reservations/${reservationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error(`Erreur ${res.status} : Réservation introuvable`);
        }

        const r = await res.json();

        // Formatage des dates pour l'affichage français
        const dateArrivee = new Date(r.checkIn).toLocaleDateString('fr-FR');
        const dateDepart = new Date(r.checkOut).toLocaleDateString('fr-FR');

        // Injection des données dans le HTML
        container.innerHTML = `
            <h2>Réservation - Catway N°${r.catwayNumber}</h2>
            <p><strong>ID Réservation :</strong> <code>${r._id}</code></p>
            <p><strong>Client :</strong> ${r.clientName}</p>
            <p><strong>Bateau :</strong> ${r.boatName}</p>
            <p><strong>Date d'arrivée :</strong> ${dateArrivee}</p>
            <p><strong>Date de départ :</strong> ${dateDepart}</p>
        `;
    } catch (err) {
        container.innerHTML = '';
        errorMsg.textContent = err.message;
    }
}

// Lancement de la fonction au chargement de la page
loadReservationDetails();