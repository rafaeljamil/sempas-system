const express = require('express')
const Cadastro = require('../models/usuarios')
const Visita = require('../models/visitas')
const Relatorio = require('../models/relatoriosSociais')
const router = express.Router({mergeParams:true})

router.get('/', async (req,res) => {
    //console.log(req.params.id)
    const visita = await Visita.findById(req.params.id).populate('visitas').exec()
    const rel = await Relatorio.findOne({visitaId:req.params.id})
    // console.log(cad)
    let mensagem
    if (rel != null){
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${visita.id}`)
        return mensagem = "Não permitido mais de um relatório por visita"
    }
    res.render('partials/relatorioForm.ejs', {visita:visita, mensagem:mensagem})
    //console.log(visita.relatorioId)
})

router.post('/', async (req,res) => {
    let visita = await Visita.findById(req.params.id).populate('visitas')
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
        await rel.remove()
        console.log("Relatório removido com sucesso")
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }
})

module.exports = router