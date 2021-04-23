const mongoose = require('mongoose')

const relatorioSocialSchema = mongoose.Schema({
    relatorio:{
        type: String,
        required: true
    },
    visitaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'visitas'
    },
    criadoEm:{
        type: Date,
        required: true,
        default: Date.now
    },
    // criadoPor: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'operador',
    //     default: 'Operador'
    // }
})

module.exports = mongoose.model('relatoriossociais', relatorioSocialSchema)