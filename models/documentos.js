const mongoose = require('mongoose')

const documentosSchema = mongoose.Schema({
    rgFrenteImagem: {
        type: Buffer,
        required: true
    },
    rgFrenteImagemTipo: {
        type: String,
        required: true
    },
    rgCostaImagem:{
        type: Buffer
    },
    rgCostaImagemTipo:{
        type: Buffer  
    },
    cpfImagem: {
        type: Buffer,
        required: true
    },
    cpfmagemTipo: {
        type: String,
        required: true
    },
    compResImagem: {
        type: Buffer,
        required: true
    },
    compResImagemTipo: {
        type: String,
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usuario'
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
    if(this.rgFrenteImagem != null && this.rgFrenteImagemTipo != null){
        return `data: ${this.rgFrenteImagemTipo};charset=utf-8;base64,${this.rgFrenteImagem.toString('base64')}`
    }
})

documentosSchema.virtual('rgCostaImagemPath').get(function(){
    if(this.rgCostaImagem != null && this.rgCostaImagemTipo != null){
        return `data: ${this.rgCostaImagemTipo};charset=utf-8;base64,${this.rgCostaImagem.toString('base64')}`
    }
})

//CPF
documentosSchema.virtual('cpfImagemPath').get(function(){
    if(this.cpfImagem != null && this.cpfImagemTipo != null){
        return `data: ${this.cpfImagemTipo};charset=utf-8;base64,${this.cpfImagem.toString('base64')}`
    }
})

//Comprovante de residência
documentosSchema.virtual('compResImagemPath').get(function(){
    if(this.compResImagem != null && this.compResImagemTipo != null){
        return `data: ${this.compResImagemTipo};charset=utf-8;base64,${this.compResImagem.toString('base64')}`
    }
})


module.exports = mongoose.model('documentos', documentosSchema)