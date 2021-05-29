const mongoose = require('mongoose')

const veiculosSchema = mongoose.Schema({
    criadoEm:{
        type:Date,
        required:true,
        default: Date.now
    },
    placa:{
        type: String,
        required: true
    },
    ano:{
        type:Number,
        required:true
    },
    marca:{
        type:String,
        required:true
    },
    modelo:{
        type:String,
        required:true
    },
    km:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('veiculos', veiculosSchema)