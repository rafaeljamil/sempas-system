const mongoose = require('mongoose')
const Docs = require('./documentos')

const usuarioSchema = mongoose.Schema({
    nome: { 
        nomeCompleto:{ type:String, required: true },
        apelido:{ type:String }
    },
    rg: {
        numero:{ type: Number, required: true },
        orgaoExpedidor: { type: String, required: true },
        uf: { type: String, required: true },
        dataEmissao:{ type: Date, required: true }
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
    endereco: {
        logradouro: { type: String, required: true },
        numero: { type: Number },
        complemento: { type: String },
        cep: { type: Number, required: true },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true }
    },
    contatos: {
        fixo: { type: Number },
        celular: { type: Number, required: true },
        email: { type: String }
    },
    criadoEm: {
        type: Date,
        required: true,
        default: Date.now
    },
    // criadoPor: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Operador',
    //     default: 'Default'
    // }
})

// usuarioSchema.pre('remove', function(next){
//     Docs.find({usuarioId: this.id}, (err, docs) => {
//         if (err){
//             next(err)
//         } else if (docs.lenght > 0){
//             next(new Error('Este cadastro contém documentos no banco de dados.'))
//         } else {
//             next()
//         }
//     })
// })

module.exports = mongoose.model('usuarios', usuarioSchema)