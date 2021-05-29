const express = require('express');
const router = express.Router()
const Veiculos = require('../models/veiculos')
const Rotas = require('../models/rotas')


//GET
router.get('/', async (req,res) => {
    veiculos = await Veiculos.find({})
    rotas = await Rotas.find({})
    res.render('garagem/garagemVer', {veiculos:veiculos, rotas:rotas})
})

router.get('/veiculo', (req,res) => {
    veiculo = new Veiculos()
    res.render('garagem/garagemNovoVeiculo', {veiculo:veiculo})
})

router.get('/rota', async (req,res) => {
    veiculos = await Veiculos.find({})
    res.render('garagem/garagemNovaRota', {veiculos:veiculos})
})

router.get('/veiculo/:id', async (req,res) => {
    veiculo = await Veiculos.findById(req.params.id)
    res.render('garagem/garagemVerVeiculo', {veiculo:veiculo})
})


//POST
router.post('/veiculo', async (req,res) => {
    veiculo = new Veiculos({
        placa:req.body.placa,
        ano:req.body.ano,
        marca:req.body.marca,
        modelo:req.body.modelo,
        km:req.body.km
    })
    try{
        let save = await veiculo.save()
        res.redirect('/garagem')
    }
    catch{
        res.redirect('/garagem')
    }
})

router.post('/rota', async (req,res) => {
    try{
        let veiculo = await Veiculos.findOne({placa:req.body.placa})
        let rota = new Rotas({
            veiculoId: veiculo.id,
            placa: req.body.placa,
            kmInicial: req.body.kmInicial,
            kmFinal: req.body.kmFinal,
            origem: req.body.origem,
            destino: req.body.destino,
            responsavel: req.body.responsavel
        })
        let save = await rota.save()
        console.log("Rota salva com sucesso.")
        res.redirect('/garagem')
    }catch(err){
        console.log(err)
        res.redirect('/garagem')
    }

})


//PUT
router.put('/veiculo/:id', async (req,res) => {
    veiculo = await Veiculos.findById(req.params.id)

    try{
        veiculo.placa = req.body.placa,
        veiculo.ano = req.body.ano,
        veiculo.marca = req.body.marca,
        veiculo.modelo = req.body.modelo,
        veiculo.km = req.body.km
        salvar = await veiculo.save()
        res.redirect('/garagem')
    }
    catch{
        res.redirect('/garagem')
    }
})


//DELETE
module.exports = router