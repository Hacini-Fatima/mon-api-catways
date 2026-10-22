// public/javascripts/catway.js

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
}

// 1. On récupère l'ID depuis l'URL (ex: /catway/65f1a2b3...)
// window.location.pathname vaut "/catway/65f1a2b3..."
// .split('/') coupe en morceaux : ["", "catway", "65f1a2b3..."]
// .pop() prend le dernier élément : "65f1a2b3..."
const pathParts = window.location.pathname.split('/');
const catwayId = pathParts.pop(); 

const container = document.getElementById('detailsContainer');
const errorMsg = document.getElementById('errorMessage');
// 2. Fonction pour charger les détails du catway
async function loadCatwayDetails() {
    try {
        const res = await fetch(`/api/catways/${catwayId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Gestion des erreurs
        if (!res.ok) {
            throw new Error(`Erreur ${res.status} : Catway introuvable`);
        }

        const catway = await res.json();

        container.innerHTML = `
            <h2>Catway N°${catway.catwayNumber}</h2>
            <p><strong>ID MongoDB :</strong> <code>${catway._id}</code></p>
            <p><strong>Type :</strong> ${catway.type}</p>
            <p><strong>État :</strong> ${catway.catwayState}</p>
        `;
    } catch (err) {
        container.innerHTML = '';
        errorMsg.textContent = '❌ ' + err.message;
    }
}

loadCatwayDetails();