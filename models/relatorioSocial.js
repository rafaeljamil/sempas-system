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
    }
})

module.exports = mongoose.Schema('relatorioSocial', relatorioSocialSchema)