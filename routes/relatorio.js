const express = require('express')
const Cadastro = require('../models/usuarios')
const Visita = require('../models/visitas')
const Relatorio = require('../models/relatoriosSociais')
const router = express.Router({mergeParams:true})

router.get('/', async (req,res) => {
    console.log(req.params.id)
    const visita = await Visita.findById(req.params.id)
    // console.log(cad)

    res.render('partials/relatorioForm.ejs', {visita:visita})
})

router.post('/', async (req,res) => {
    const visita = await Visita.findById(req.params.id)
    try{
        //console.log(req.body.editor)
        const rel = new Relatorio({
            visitaId: req.params.id,
            relatorio: req.body.editor
        })
        //console.log(req.body.relatorio)
        //console.log(rel)
        await rel.save()
        console.log('Relatório salvo com sucesso')
    }catch(err){
        console.log(err)
    }
    // rel = req.body.relatorio
    // console.log(rel)
    res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
})

router.get('/editar', async (req,res) => {
    const visita = await Visita.findById(req.params.id)
    const rel = await Relatorio.findOne({visitaId: req.params.id}).populate('relatoriossociais')
    //console.log(rel.id)
    res.render('partials/editarRelatorio', {visita:visita, rel:rel})
})

router.put('/editar', async (req,res) => {
    try{
        const rel = await Relatorio.findOne({visitaId: req.params.id})
        rel.relatorio = req.body.editor
        await rel.save()
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }catch{
        console.log("Erro ao editar")
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }
    //res.send('Rota de editar')
})

router.delete('/deletar', async (req,res) => {
    try{
        const visita = await Visita.findById(req.params.id)
        const rel = await Relatorio.findOne({visitaId: req.params.id})
        //console.log(visita.valor)
        //console.log(rel.id)
        rel.remove()
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }catch{
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}/relatorio`)
    }
})

module.exports = router