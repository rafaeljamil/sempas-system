const express = require("express")
const Cadastro = require('../models/usuarios')
const Visita = require('../models/visitas')
const Relatorio = require('../models/relatoriosSociais')
const router = express.Router({mergeParams:true})
const relatorioRoute = require('../routes/relatorio')
const imprimirRoute = require('../routes/imprimir')

router.use('/:id/relatorio', relatorioRoute)
router.use('/:id/imprimir', imprimirRoute)


//GET
router.get("/", async (req,res) => {
    const cad = await Cadastro.findById(req.params.id)
    const rel = await Relatorio.findOne({usuarioId: req.params.id})
    //console.log(rel.relatorioPath)
    res.render("visitas/novaVisita", {cad:cad, rel:rel})
})

router.get("/:id", async (req,res) => {
    let visita = await Visita.findById(req.params.id)
    let cad = await Cadastro.findById(visita.usuarioId)
    let rel = await Relatorio.findOne({visitaId:visita.id})
    try{
        res.render("visitas/verVisita", {visita:visita, cad:cad, rel:rel})
    }
    catch{
        res.redirect(`/cadastros/${cad.id}`)
    }
})


//POST
router.post("/", async (req,res) => {
    let visita = new Visita({
        usuarioId: req.params.id,
        dataVisita: req.body.dataVisita,
        local: req.body.localVisita,
        motivo: req.body.motivoVisita,
        valor: req.body.valor,
        observacoes: req.body.observacoes
    })
    try{
        visita.save()
        console.log('Visita salva com sucesso.')
        res.redirect(`/cadastros/${req.params.id}`)
    }
    catch{
        res.redirect('/')
    }
})


//PUT
router.put("/:id", async (req,res) => {
    let visita = await Visita.findById(req.params.id)
    let cad = await Cadastro.findById(visita.usuarioId)
    try{
        visita.usuarioId = req.params.id,
        visita.dataVisita = req.body.dataVisita,
        visita.local = req.body.localVisita,
        visita.motivo = req.body.motivoVisita,
        visita.valor = req.body.valor,
        visita.observacoes = req.body.observacoes
        await visita.save()
        console.log("Visita atualizada com sucesso.")
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }catch{
        res.redirect(`/cadastros/${cad.id}`)
    }
})


//DELETE
router.delete("/:id/deletar", async (req,res) => {
    let visita = await Visita.findById(req.params.id)
    let cad = await Cadastro.findById(visita.usuarioId)
    let rel = await Relatorio.findOne({visitaId:visita.id})
    try{
        await rel.remove()
        await visita.remove()
        console.log("Visita e relatório apagados com sucesso.")
        res.redirect(`/cadastros/${cad.id}`)
    }
    catch{
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }
})

module.exports = router;