const mongoose = require('mongoose')

const operadorSchema = mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    cpf:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    criadoEm:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.Schema('operador', operadorSchema)