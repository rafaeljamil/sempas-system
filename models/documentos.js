const mongoose = require('mongoose')
const path = require('path')

const caminhoBaseDocs = "uploads/Documentos"

const documentosSchema = mongoose.Schema({
    rgFrenteImagem: {
        type: String,
        required: true
    },
    rgVersoImagem:{
        type: String
    },
    cpfImagem: {
        type: String,
        required: true
    },
    compResImagem: {
        type: String,
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usuarios'
    },
    criadoEm: {
        type: Date,
        required: true,
        default: Date.now
    }
})

//Decodificar as imagens
//RG
documentosSchema.virtual('rgFrenteImagemPath').get(function(){
    if(this.rgFrenteImagem != null && this.usuarioId != null){
        return path.join('./public/', caminhoBaseDocs,  this.rgFrenteImagem)
    }
})

documentosSchema.virtual('rgVersoImagemPath').get(function(){
    if(this.rgVersoImagem != null && this.usuarioId != null){
        return path.join('public/', caminhoBaseDocs, this.rgVersoImagem)
    }
})

//CPF
documentosSchema.virtual('cpfImagemPath').get(function(){
    if(this.cpfImagem != null && this.usuarioId != null){
        return path.join('public/', caminhoBaseDocs, this.cpfImagem)
    }
})

//Comprovante de residência
documentosSchema.virtual('compResImagemPath').get(function(){
    if(this.compResImagem != null && this.usuarioId != null){
        return path.join('public/', caminhoBaseDocs, this.compResImagem)
    }
})


module.exports = mongoose.model('documentos', documentosSchema)

module.exports.caminhoBaseDocs = caminhoBaseDocs