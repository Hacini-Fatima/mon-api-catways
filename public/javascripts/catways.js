// ============================================================
// catways.js - Gestion de l'affichage de la liste des catways
// ============================================================
// Ce script est chargé sur la page /catways (views/catways.ejs).
// Il récupère les données depuis l'API (avec un token JWT) et les
// injecte dynamiquement dans le tableau HTML.

// ============================================================
// 1. VÉRIFICATION DE L'AUTHENTIFICATION
// ============================================================
// On récupère le token JWT stocké dans le navigateur lors du login.
const token = localStorage.getItem('token');

// Si aucun token n'est trouvé, l'utilisateur n'est pas connecté :
// on le redirige immédiatement vers la page d'accueil (login).
if (!token) {
    window.location.href = '/';
}

// ============================================================
// 2. FONCTION : CHARGER LES CATWAYS DEPUIS L'API
// ============================================================
async function loadCatways() {
    // On envoie une requête HTTP GET à l'API.
    // Le header "Authorization" contient le token pour prouver qu'on est connecté.
    const res = await fetch('/api/catways', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Si la réponse n'est pas un succès (ex: token expiré -> 401, serveur down -> 500) :
    if (!res.ok) {
        // On affiche le code d'erreur dans un paragraphe <p id="message"> de la page.
        document.getElementById('message').textContent = 'Erreur : ' + res.status;
        return; // On arrête la fonction ici pour ne pas exécuter la suite.
    }

    // On convertit la réponse HTTP en objet JSON (tableau d'objets catways).
    const catways = await res.json();

    // On cible le corps du tableau (<tbody>) où on va injecter les lignes.
    const tbody = document.querySelector('#catwaysTable tbody');

    // ⚡ On vide le tableau AVANT d'ajouter les nouvelles lignes.
    // Cela évite d'avoir des doublons si la fonction est rappelée (ex: rafraîchissement).
    tbody.innerHTML = '';

    // On parcourt chaque catway reçu de l'API.
    catways.forEach(c => {
        // On crée une nouvelle ligne de tableau (<tr>) vide.
        const tr = document.createElement('tr');

        // On remplit la ligne avec les colonnes (<td>) et les données du catway.
        // - catwayNumber : le numéro du pont
        // - type : "long" ou "short"
        // - catwayState : la description de l'état
        // - Un lien "Voir" qui pointe vers la page de détails avec l'ID MongoDB du catway
        tr.innerHTML = `
            <td>${c.catwayNumber}</td>
            <td>${c.type}</td>
            <td>${c.catwayState}</td>
            <td><a href="/catway/${c._id}">Voir</a></td>
        `;

        // On ajoute la ligne complète au tableau.
        tbody.appendChild(tr);
    });
}

// ============================================================
// 3. GESTION DE LA DÉCONNEXION
// ============================================================
// On écoute le clic sur le bouton "Déconnexion" (présent dans la navbar).
document.getElementById('logoutBtn').addEventListener('click', () => {
    // On supprime le token et les infos utilisateur du stockage local.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // On redirige l'utilisateur vers la page de login.
    window.location.href = '/';
});

// ============================================================
// 4. LANCEMENT AU CHARGEMENT DE LA PAGE
// ============================================================
// On appelle la fonction dès que le script est chargé pour afficher
// les données immédiatement sans attendre une action de l'utilisateur.
loadCatways();