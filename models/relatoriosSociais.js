const mongoose = require('mongoose')
const path = require('path')

const caminhoBaseRels = "uploads/Relatorios"

const relatorioSocialSchema = mongoose.Schema({
    relatorio:{
        type: String,
        required: true
    },
    pdfBlob:{
        type: String,
        required: false
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

// relatorioSocialSchema.virtual('relatorioPath').get(function(){
//     if(this.relatorio != null){
//         return path.join('./public/', caminhoBaseRels,  this.relatorio)
//     }
// })

module.exports = mongoose.model('relatoriossociais', relatorioSocialSchema)