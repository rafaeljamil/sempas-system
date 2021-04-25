const mongoose = require("mongoose")

const visitasSchema = mongoose.Schema ({
    criadoEm:{
        type: Date,
        required: true,
        default: Date.now
    },
    usuarioId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usuarios'
    },
    dataVisita:{
        type: Date,
        required: true
    },
    local:{
        type: String,
        required: true
    },
    motivo:{
        type: String,
        required: true
    },
    valor:{
        type: Number,
        default: 0
    },
    observacoes:{
        type: String
    },
})

module.exports = mongoose.model('visitas', visitasSchema)