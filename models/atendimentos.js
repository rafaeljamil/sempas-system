const mongoose = require('mongoose')

const atendimentosSchema = mongoose.Schema({
    criadoEm:{
        type:Date, 
        required:true, 
        default: Date.now
    },
    nome:{
        type:String, 
        required:true
    },
    rg:{
        type:Number, 
        required:true
    },
    cpf:{
        type:Number, 
        required:true
    },
    nis:{
        type:Number, 
        required:true
    },
    endereco:{
        type:String, 
        required:true
    },
    atendimento:{
        type:String, 
        required:true
    },
    //operador:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'operadores'}
})

module.exports = mongoose.model('atendimentos', atendimentosSchema)