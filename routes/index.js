const express = require('express')
const Cadastros = require('../models/usuarios')
const Atendimentos = require('../models/atendimentos')
const Veiculos = require('../models/veiculos')
const router = express.Router()


//GET
router.get('/', async (req,res) => {
    let cad
    let atendimentos
    let veiculos
    let vLen
    try{
        cadastros = await Cadastros.find({})
        cad = await Cadastros.find({}).sort({criadoEm: 'desc'}).limit(10).exec()
        atendimentos = await Atendimentos.find({})
        veiculos = await Veiculos.find({})
        res.render('index', 
        {
            cad:cad, 
            atendimentos:atendimentos, 
            veiculos:veiculos,
            cadastros:cadastros
        })
    }catch{
        cad = []
    }

})

module.exports = router