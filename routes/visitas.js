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
    const visita = new Visita()
    //console.log(rel.relatorioPath)
    res.render("visitas/novaVisita", {cad:cad, rel:rel, visita:visita})
})

router.get("/:id", async (req,res) => {
    let visita = await Visita.findById(req.params.id)
    let cad = await Cadastro.findById(visita.usuarioId)
    let rel = await Relatorio.findOne({visitaId:visita.id})
    try{
        //console.log (cad)
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
        dataVisita: req.body.data,
        local: req.body.local,
        motivo: req.body.motivo,
        valor: req.body.valor,
        observacoes: req.body.observacoes
    })
    try{
        //console.log(req.body)
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
        visita.dataVisita = req.body.data,
        visita.local = req.body.local,
        visita.motivo = req.body.motivo,
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
        if(rel){
            await rel.remove()
        }
        await visita.remove()
        console.log("Visita e relatório apagados com sucesso.")
        res.redirect(`/cadastros/${cad.id}`)
    }
    catch{
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${req.params.id}`)
    }
})

module.exports = router;