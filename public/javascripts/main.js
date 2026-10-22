// public/javascripts/main.js

// Gestion du formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const messageEl = document.getElementById('loginMessage');
    // Récupération des données du formulaire
    const data = {
        email: form.email.value,
        password: form.password.value
    };
    // Affichage d'un message de connexion en cours
    messageEl.textContent = 'Connexion en cours...';
    messageEl.style.color = 'blue';
    // Envoi de la requête de connexion
    try {
        const res = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        // Gestion des erreurs de connexion
        if (!res.ok) {
            const err = await res.json();
            messageEl.textContent = err.message || 'Erreur de connexion';
            messageEl.style.color = 'red';
            return;
        }
        // Récupération du token et des infos utilisateur
        const result = await res.json();
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        // On stocke aussi le token dans un cookie (pour que le serveur le lise)
        document.cookie = `token=${result.token}; path=/; max-age=86400`; // valide 24h
        // Redirection vers le dashboard
        window.location.href = '/dashboard';
    } catch (err) {
        messageEl.textContent = 'Erreur réseau. Vérifie que le serveur tourne.';
        messageEl.style.color = 'red';
    }
});