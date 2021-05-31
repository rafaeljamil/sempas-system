const express = require('express');
const router = express.Router()
const Veiculos = require('../models/veiculos')
const Rotas = require('../models/rotas')


//GET
router.get('/', async (req,res) => {
    veiculos = await Veiculos.find({})
    rotas = await Rotas.find({}).sort({criadoEm: 'desc'}).exec()
    res.render('garagem/garagem', {veiculos:veiculos, rotas:rotas})
})

router.get('/veiculo', (req,res) => {
    veiculo = new Veiculos()
    res.render('garagem/garagemNovoVeiculo', {veiculo:veiculo})
})

router.get('/rota', async (req,res) => {
    let veiculos = await Veiculos.find({})
    let rota = new Rotas()
    res.render('garagem/garagemNovaRota', {veiculos:veiculos, rota:rota})
})

router.get('/veiculo/:id', async (req,res) => {
    let veiculo = await Veiculos.findById(req.params.id)
    res.render('garagem/garagemVerVeiculo', {veiculo:veiculo})
})

router.get('/rota/:id', async (req,res) => {
    let veiculos = await Veiculos.find({})
    let rota = await Rotas.findById(req.params.id)
    res.render('garagem/garagemVerRota', {veiculos:veiculos, rota:rota})
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
        console.log('Veículo salvo com sucesso.')
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
        if (veiculo.km < req.body.kmFinal){
            veiculo.km = req.body.kmFinal
            let saveVeiculo = await veiculo.save()
        }
        let saveRota = await rota.save()
        
        console.log("Rota salva com sucesso.")
        res.redirect('/garagem')
    }catch(err){
        console.log(err)
        res.redirect('/garagem')
    }

})


//PUT
router.put('/veiculo/:id', async (req,res) => {
    let veiculo = await Veiculos.findById(req.params.id)

    try{
        veiculo.placa = req.body.placa,
        veiculo.ano = req.body.ano,
        veiculo.marca = req.body.marca,
        veiculo.modelo = req.body.modelo,
        veiculo.km = req.body.km
        salvar = await veiculo.save()
        console.log('Veículo editado com sucesso.')
        res.redirect('/garagem')
    }
    catch{
        res.redirect('/garagem')
    }
})

router.put('/rota/:id', async (req,res) => {
    try{
        let veiculo = await Veiculos.findOne({placa:req.body.placa})
        let rota = await Rotas.findById(req.params.id)
        rota.veiculoId = veiculo.id,
        rota.placa = req.body.placa,
        rota.kmInicial = req.body.kmInicial,
        rota.kmFinal = req.body.kmFinal,
        rota.origem = req.body.origem,
        rota.destino = req.body.destino,
        rota.responsavel = req.body.responsavel
        salvar = await rota.save()
        console.log('Rota editada com sucesso.')
        res.redirect('/garagem')
    }
    catch{
        res.redirect('/garagem')
    }
})

//DELETE
router.delete('/veiculo/:id/deletar', async (req,res) => {
    let veiculo = await Veiculos.findById(req.params.id)
    try{
        let apagar = await veiculo.remove()
        console.log('Veículo removido com sucesso.')
        res.redirect('/garagem')
    }catch{
        res.redirect('/garagem')
    }
})

router.delete('/rota/:id/deletar', async (req,res) => {
    let rota = await Rotas.findById(req.params.id)
    try{
        let apagar = await rota.remove()
        console.log('Rota removida com sucesso.')
        res.redirect('/garagem')
    }catch(err){
        console.log(err)
        res.redirect('/garagem')
    }
})
module.exports = router