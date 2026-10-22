// public/javascripts/reservations.js

const token = localStorage.getItem('token');
if (!token) window.location.href = '/';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
});
// Fonction pour charger toutes les réservations
async function loadAllReservations() {
    const container = document.getElementById('reservationsContainer');
    const message = document.getElementById('message');

    try {
        // Appel à la route globale
        const res = await fetch('/api/reservations/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Vérification de la réponse
        if (!res.ok) throw new Error("Impossible de charger les réservations");
        
        const reservations = await res.json();
        container.innerHTML = '';

        if (reservations.length === 0) {
            container.innerHTML = '<p>Aucune réservation pour le moment.</p>';
            return;
        }
        // Parcours des réservations et affichage
        reservations.forEach(r => {
            const dateIn = new Date(r.checkIn).toLocaleDateString('fr-FR');
            const dateOut = new Date(r.checkOut).toLocaleDateString('fr-FR');

            const div = document.createElement('div');
            div.className = 'resa-item';
            div.innerHTML = `
                <strong>Catway N°${r.catwayNumber}</strong> : 
                ${r.clientName} (${r.boatName}) 
                — du ${dateIn} au ${dateOut}
                <a href="/reservation/${r.catwayId}/${r._id}">Voir</a>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = '';
        message.textContent = 'Erreur : ' + err.message;
    }
}
loadAllReservations();