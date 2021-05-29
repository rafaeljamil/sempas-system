const mongoose = require('mongoose')

const rotasSchema = mongoose.Schema({
    criadoEm:{
        type:Date,
        required:true,
        default: Date.now
    },
    veiculoId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'veiculos'
    },
    placa:{
        type: String,
        required: true,
    },
    kmInicial:{
        type:Number, 
        required:true
    },
    kmFinal:{
        type:Number,
        required:true
    },
    origem:{
        type:String,
        required:true
    },
    destino:{
        type:String,
        required:true
    },
    responsavel:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('rotas', rotasSchema)