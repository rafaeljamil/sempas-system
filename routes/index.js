const express = require('express')
const Cadastros = require('../models/usuario')
const router = express.Router()

router.get('/', async (req,res) => {
    let cadastros
    try{
        cadastros = await Cadastros.find({}).sort({criadoEm: 'desc'}).limit(10).exec()
    }catch{
        cadastros = []
    }
    res.render('index', {cadastros:cadastros})
})

module.exports = router