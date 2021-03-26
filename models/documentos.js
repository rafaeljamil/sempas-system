const mongoose = require('mongoose')

const documentosSchema = mongoose.Schema({
    rgImagem: {
        type: Buffer,
        required: true
    },
    rgImagemTipo: {
        type: String,
        required: true
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
    }
})

//Decodificar as imagens
//RG
documentosSchema.virtual('rgImagemPath').get(function(){
    if(this.rgImagem != null && this.rgImagemTipo != null){
        return `data: ${this.rgImagemTipo};charset=utf-8;base64,${this.rgImagem.toString('base64')}`
    }
})

//CPF
documentosSchema.virtual('cpfImagemPath').get(function(){
    if(this.cpfImagem != null && this.cpfmagemTipo != null){
        return `data: ${this.cpfmagemTipo};charset=utf-8;base64,${this.cpfImagem.toString('base64')}`
    }
})

//Comprovante de residência
documentosSchema.virtual('compResPath').get(function(){
    if(this.compResImagem != null && this.compResImagemTipo != null){
        return `data: ${this.compResImagemTipo};charset=utf-8;base64,${this.compResImagem.toString('base64')}`
    }
})


module.exports = mongoose.Schema('documentos', documentosSchema)