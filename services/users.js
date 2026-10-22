// services/users.js : ce fichier contient les fonctions métier pour gérer les utilisateurs

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// FONCTIONS MÉTIER PURES
// ============================================================

// Crée un nouvel utilisateur
async function createUser(data) {
    const { name, email, password } = data;
    
    // Vérification de l'unicité de l'email
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Cet email est déjà utilisé');
    
    // Hashage du mot de passe (sécurité)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'utilisateur avec le mot de passe hashé
    const newUser = new User({ name, email, password: hashedPassword });
    return await newUser.save();
}

// Authentifie un utilisateur et renvoie un token JWT
async function login(email, password) {
    // On cherche l'utilisateur par son email
    const user = await User.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé');
    
    // On compare le mot de passe fourni avec le hash en base
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mot de passe incorrect');
    
    // On génère le token JWT (valide 24h)
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
    // On renvoie l'utilisateur et le token
    return { user, token };
}

// Récupère tous les utilisateurs (sans les mots de passe)
async function getAllUsers() {
    // .select('-password') permet de ne pas renvoyer le mot de passe hashé
    return await User.find().select('-password');
}

// Récupère un utilisateur spécifique par son ID (sans le mot de passe)
async function getUserById(id) {
    return await User.findById(id).select('-password');
}

// Met à jour un utilisateur spécifique par son ID
async function updateUser(id, data) {
    // Si l'utilisateur change son mot de passe, on doit le re-hacher
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    // On met à jour l'utilisateur et on renvoie le nouvel objet (new: true)
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }).select('-password');
}

// Supprime un utilisateur spécifique par son ID
async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}

// Export des fonctions pour qu'elles soient utilisables ailleurs
module.exports = {
    createUser,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};