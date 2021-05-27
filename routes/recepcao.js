const express = require('express')
const router = express.Router()
const Atendimento = require('../models/atendimentos')

router.get('/', async (req,res) => {
    atendimento = await Atendimento.find({})
    res.render('recepcao/recepcao', {atendimento:atendimento})
    //console.log(atendimento)
})

router.get('/novo', (req,res) => {
    atendimento = new Atendimento()
    res.render('partials/recepForm', {atendimento:atendimento})
})

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
router.get('/:id', async (req,res) => {
    res.send('ver')
})

router.post('/:id', async (req,res) => {
    res.send('modificar')
})

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