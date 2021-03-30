const mongoose = require('mongoose')

const relatorioSocialSchema = mongoose.Schema({
    relatorio:{
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usuario'
    },
    criadoEm:{
        type: Date,
        required: true,
        default: Date.now
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'operador',
        default: 'Operador'
    }
})

module.exports = mongoose.model('relatorioSocial', relatorioSocialSchema)