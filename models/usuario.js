const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    rg: {
        type: Number,
        required: true
    },
    cpf: {
        type: Number,
        required: true
    },
    nis: {
        type: Number,
        required: true
    },
    nomeMae:{
        type: String,
        required: true
    },
    end: {
        logradouro: {
            type: String,
            required: true
        },
        numero: {
            type: Number,
        },
        complemento: {
            type: String
        },
        cep: {
            type: Number,
            required: true
        },
        cidade: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        }
    },
    contatos: {
        fixo: {
            type: Number,
        },
        celular: {
            type: Number,
            required: true
        },
        email: {
            type: String
        }
    },
    relatorioSocial:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'relatorioSocial'
    },
    documentos:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'documentos'
    },
    criadoEm: {
        type: Date,
        required: true,
        default: Date.now
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'operador'
    }
})

module.exports = mongoose.Schema('usuario', usuarioSchema)