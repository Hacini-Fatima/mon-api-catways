const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema(
    {
        catwayNumber: {
            type: Number,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ['long', 'short'],
            required: true
        },
        catwayState: {
            type: String,
            default: 'bon état'
        }
    },
    {
        timestamps: true  // ajoute createdAt et updatedAt automatiquement
    }
);

module.exports = mongoose.model('Catway', catwaySchema);