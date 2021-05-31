const express = require('express')
const router = express.Router()
const Atendimento = require('../models/atendimentos')


//GET
router.get('/', async (req,res) => {
    atendimento = await Atendimento.find({})
    res.render('recepcao/recepcao', {atendimento:atendimento})
    //console.log(atendimento)
})

router.get('/novo', (req,res) => {
    atendimento = new Atendimento()
    res.render('recepcao/recepcaoNovoAtendimento', {atendimento:atendimento})
})

router.get('/:id', async (req,res) => {
    let atendimento = await Atendimento.findById(req.params.id)
    res.render('recepcao/recepcaoVerAtendimento', {atendimento:atendimento})
})


//POST
router.post('/novo', async (req,res)=>{
    const atendimento = new Atendimento({
        nome:req.body.nome,
        endereco:req.body.endereco,
        rg:req.body.rg,
        cpf:req.body.cpf,
        nis:req.body.nis,
        atendimento:req.body.atendimento
    });
    try{
        const save = await atendimento.save()
        console.log("Atendimento salvo com sucesso.")
        // console.log("Nome: "+req.body.nome)
        // console.log("Endereço: "+req.body.endereco)
        // console.log(atendimento)
        res.redirect('/recepcao')
    }catch(err){
        if(err){console.log(err)}
        res.redirect('/')
    }
})


//PUT
router.put('/:id', async (req,res) => {
    let atendimento = await Atendimento.findById(req.params.id)
    try{
        atendimento.nome = req.body.nome,
        atendimento.endereco = req.body.endereco,
        atendimento.rg = req.body.rg,
        atendimento.cpf = req.body.cpf,
        atendimento.nis = req.body.nis,
        atendimento.atendimento = req.body.atendimento

        let save = await atendimento.save()
        console.log('Atendimento modificado com sucesso.')
        res.redirect('/recepcao')
    }catch{
        res.redirect('/')
    }
})


//DELETE
router.delete('/:id/deletar', async (req,res) => {
    //res.send("deletar")
    const atendimento = await Atendimento.findById(req.params.id)
    try{
        await atendimento.remove()
        res.redirect('/recepcao')
    }
    catch{
        res.redirect('/recepcao')
    }
})

module.exports = router