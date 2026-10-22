// ============================================================
// 1. VÉRIFICATION DE L'AUTHENTIFICATION
// ============================================================

// On récupère le token et l'utilisateur depuis le localStorage
const token = localStorage.getItem('token');
// On récupère l'utilisateur depuis le localStorage, ou null si pas trouvé
const user = JSON.parse(localStorage.getItem('user') || 'null');
// Si pas de token, on redirige vers la page de login
if (!token) window.location.href = '/';
// Si on est sur la page de login
if (user) {
    const userInfo = document.getElementById('userInfo'); // On affiche le nom de l'utilisateur connecté
    if (userInfo) userInfo.textContent = `Connecté : ${user.name}`; // On affiche le nom de l'utilisateur connecté
}
// On récupère le bouton de déconnexion et on lui ajoute un événement
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) { // Si le bouton existe (on est sur une page protégée)
    logoutBtn.addEventListener('click', () => { // On supprime le token et l'utilisateur du localStorage
        localStorage.clear(); // On supprime aussi l'utilisateur du localStorage
        // On supprime aussi le cookie
        document.cookie = 'token=; path=/; max-age=0'; // On supprime le cookie en le mettant à 0
        window.location.href = '/'; // On redirige vers la page de login
    });
}
// Fonction utilitaire pour afficher un message dans une boîte de message
function showMsg(id, text, isError = false) {
    const el = document.getElementById(id); // Si l'élément n'existe pas, on ne fait rien
    if (!el) return;
    el.textContent = text;
    el.className = 'msg-box ' + (isError ? 'text-danger' : 'text-success');
}

// ============================================================
// 2. CATWAYS
// ============================================================

// Créer un catway
const formCreateCatway = document.getElementById('createCatwayForm');
if (formCreateCatway) {
    formCreateCatway.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            catwayNumber: parseInt(e.target.catwayNumber.value),
            type: e.target.type.value,
            catwayState: e.target.catwayState.value
        };
        try {
            const res = await fetch('/api/catways', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) { showMsg('msgCreateCatway', '✅ Catway créé !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgCreateCatway', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgCreateCatway', '❌ Erreur réseau', true); }
    });
}

// Modifier un catway
const formUpdateCatway = document.getElementById('updateCatwayForm');
if (formUpdateCatway) {
    formUpdateCatway.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/catways/${e.target.id.value}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ catwayState: e.target.catwayState.value })
            });
            if (res.ok) { showMsg('msgUpdateCatway', '✅ État modifié !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgUpdateCatway', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgUpdateCatway', '❌ Erreur réseau', true); }
    });
}

// Supprimer un catway
const formDeleteCatway = document.getElementById('deleteCatwayForm');
if (formDeleteCatway) {
    formDeleteCatway.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!confirm("Supprimer ce catway ?")) return;
        try {
            const res = await fetch(`/api/catways/${e.target.id.value}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) { showMsg('msgDeleteCatway', '✅ Catway supprimé !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgDeleteCatway', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgDeleteCatway', '❌ Erreur réseau', true); }
    });
}

// Afficher les détails d'un catway
const formDisplayCatway = document.getElementById('displayCatwayForm');
if (formDisplayCatway) {
    formDisplayCatway.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resultDiv = document.getElementById('catwayDetailsResult');
        resultDiv.innerHTML = '⏳ Chargement...';
        try {
            const res = await fetch(`/api/catways/${e.target.id.value}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Catway introuvable');
            const catway = await res.json();
            resultDiv.innerHTML = `
                <div class="details-box">
                    <h4>Catway N°${catway.catwayNumber}</h4>
                    <p><strong>ID :</strong> ${catway._id}</p>
                    <p><strong>Type :</strong> ${catway.type}</p>
                    <p><strong>État :</strong> ${catway.catwayState}</p>
                </div>
            `;
        } catch (err) { resultDiv.innerHTML = `<p class="text-danger">❌ ${err.message}</p>`; }
    });
}

// ============================================================
// 3. RÉSERVATIONS
// ============================================================

// Créer une réservation
const formCreateResa = document.getElementById('createReservationForm');
if (formCreateResa) {
    formCreateResa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dateIn = new Date(e.target.checkIn.value);
        const dateOut = new Date(e.target.checkOut.value);
        if (dateOut <= dateIn) {
            showMsg('msgCreateResa', '❌ La date de fin doit être après la date de début.', true);
            return;
        }
        const data = {
            clientName: e.target.clientName.value,
            boatName: e.target.boatName.value,
            checkIn: dateIn.toISOString(),
            checkOut: dateOut.toISOString()
        };
        try {
            const res = await fetch(`/api/catways/${e.target.catwayId.value}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) { showMsg('msgCreateResa', '✅ Réservation créée !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgCreateResa', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgCreateResa', '❌ Erreur réseau', true); }
    });
}

// Supprimer une réservation
const formDeleteResa = document.getElementById('deleteReservationForm');
if (formDeleteResa) {
    formDeleteResa.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!confirm("Supprimer cette réservation ?")) return;
        try {
            // On cherche à quel catway appartient la réservation
            const resCatways = await fetch('/api/catways', { headers: { 'Authorization': `Bearer ${token}` } });
            const catways = await resCatways.json();
            let foundId = null;
            for (const c of catways) {
                const r = await fetch(`/api/catways/${c._id}/reservations`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (r.ok) {
                    const list = await r.json();
                    if (list.some(x => x._id === e.target.reservationId.value)) { foundId = c._id; break; }
                }
            }
            if (!foundId) { showMsg('msgDeleteResa', '❌ Réservation introuvable', true); return; }
            
            const del = await fetch(`/api/catways/${foundId}/reservations/${e.target.reservationId.value}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (del.ok) { showMsg('msgDeleteResa', '✅ Réservation supprimée !'); e.target.reset(); }
            else { const err = await del.json(); showMsg('msgDeleteResa', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgDeleteResa', '❌ Erreur réseau', true); }
    });
}

// Afficher les détails d'une réservation
const formDisplayResa = document.getElementById('displayReservationForm');
if (formDisplayResa) {
    formDisplayResa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resultDiv = document.getElementById('reservationDetailsResult');
        resultDiv.innerHTML = '⏳ Chargement...';
        try {
            const res = await fetch(`/api/catways/${e.target.catwayId.value}/reservations/${e.target.reservationId.value}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Réservation introuvable');
            const r = await res.json();
            const dateIn = new Date(r.checkIn).toLocaleDateString('fr-FR');
            const dateOut = new Date(r.checkOut).toLocaleDateString('fr-FR');
            resultDiv.innerHTML = `
                <div class="details-box">
                    <h4>Catway N°${r.catwayNumber}</h4>
                    <p><strong>Client :</strong> ${r.clientName}</p>
                    <p><strong>Bateau :</strong> ${r.boatName}</p>
                    <p><strong>Arrivée :</strong> ${dateIn}</p>
                    <p><strong>Départ :</strong> ${dateOut}</p>
                </div>
            `;
        } catch (err) { resultDiv.innerHTML = `<p class="text-danger">❌ ${err.message}</p>`; }
    });
}

// ============================================================
// 4. UTILISATEURS
// ============================================================

// Créer un utilisateur
const formCreateUser = document.getElementById('createUserForm');
if (formCreateUser) {
    formCreateUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = { name: e.target.name.value, email: e.target.email.value, password: e.target.password.value };
        try {
            const res = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) { showMsg('msgCreateUser', '✅ Utilisateur créé !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgCreateUser', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgCreateUser', '❌ Erreur réseau', true); }
    });
}

// Modifier un utilisateur
const formUpdateUser = document.getElementById('updateUserForm');
if (formUpdateUser) {
    formUpdateUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {};
        if (e.target.name.value) data.name = e.target.name.value;
        if (e.target.email.value) data.email = e.target.email.value;
        if (e.target.password.value) data.password = e.target.password.value;

        if (Object.keys(data).length === 0) {
            showMsg('msgUpdateUser', '❌ Remplis au moins un champ', true); return;
        }
        try {
            const res = await fetch(`/users/${e.target.id.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) { showMsg('msgUpdateUser', '✅ Utilisateur modifié !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgUpdateUser', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgUpdateUser', '❌ Erreur réseau', true); }
    });
}

// Supprimer un utilisateur
const formDeleteUser = document.getElementById('deleteUserForm');
if (formDeleteUser) {
    formDeleteUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!confirm("Supprimer cet utilisateur ?")) return;
        try {
            const res = await fetch(`/users/${e.target.id.value}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) { showMsg('msgDeleteUser', '✅ Utilisateur supprimé !'); e.target.reset(); }
            else { const err = await res.json(); showMsg('msgDeleteUser', '❌ ' + err.message, true); }
        } catch (err) { showMsg('msgDeleteUser', '❌ Erreur réseau', true); }
    });
}