const express = require('express')
//const Cadastro = require('../models/usuarios')
const Visita = require('../models/visitas')
const Relatorio = require('../models/relatoriosSociais')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const router = express.Router({mergeParams:true})


//GET
router.get('/', async (req,res) => {
    //console.log(req.params.id)
    const visita = await Visita.findById(req.params.id).populate('visitas').exec()
    const rel = await Relatorio.findOne({visitaId:req.params.id})
    //console.log(rel.relatorioPath)
    if (rel != null){
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${visita.id}`)
        console.log("Não permitido mais de um relatório por visita")
    }
    res.render('relatorio/__relatorioForm.ejs', {visita:visita})
    //console.log(visita.relatorioId)
})

router.get('/editar', async (req,res) => {
    const visita = await Visita.findById(req.params.id)
    const rel = await Relatorio.findOne({visitaId: req.params.id}).populate('relatoriossociais')
    //console.log(rel.id)
    res.render('relatorio/relatorioEditar', {visita:visita, rel:rel})
})


//POST
router.post('/', async (req,res) => {
    let visita = await Visita.findById(req.params.id).populate('visitas')
    let relatorio = req.body.body
    let pdfBlob = req.body.pdfBlob
    let dataVisita = visita.dataVisita.toISOString().split('T')[0]
    //console.log(relatorio)
    try{
        const rel = new Relatorio({
            visitaId: req.params.id,
            relatorio: relatorio,
            pdfBlob: pdfBlob
        })
        console.log("Quill Delta: "+relatorio)
        console.log("PDF Blob: "+pdfBlob)
        await rel.save()
    }catch(err){
        console.log(err)
    }
    res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
})


//PUT
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


//DELETE
router.delete('/deletar', async (req,res) => {
    try{
        const visita = await Visita.findById(req.params.id)
        const rel = await Relatorio.findOne({visitaId: req.params.id})
        //console.log(visita.valor)
        //console.log(rel.id)
        //console.log(rel.relatorio)
        // fs.unlink(rel.relatorio, (err => {
        //     if (err) console.log(err);
        //     else{
        //         console.log(rel.relatorio + " deletado com sucesso.")
        //     }
        // }))
        await rel.remove()
        console.log("Relatório removido com sucesso")
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }
})

module.exports = router