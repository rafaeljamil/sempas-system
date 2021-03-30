const express = require('express')
const router = express.Router()
const Cadastro = require('../models/usuario')
const Docs = require('../models/documentos')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

router.get('/', async (req,res) => {
    try{
        let cadastros = await Cadastro.find({})
        res.render("cadastros/index", {cadastros:cadastros})
    }catch{
        res.redirect('/index')
    }
        
})

router.get('/novo', (req,res) => {
    res.render('cadastros/novo')
})

router.post('/novo', async (req,res) => {
    let cadastro = new Cadastro({
        nome:{
            nomeCompleto: req.body.nome, 
            apelido: req.body.apelido
        },
        nomeMae: req.body.nomeMae,
        nis: req.body.nis,
        cpf: req.body.cpf,
        rg:{
            numero: req.body.rg,
            orgaoExpedidor: req.body.orgao,
            uf: req.body.uf,
            dataEmissao: req.body.dataEmissao
        },
        endereco: {
            logradouro: req.body.endereco,
            numero: req.body.numero,
            complemento: req.body.complemento,
            cep: req.body.cep,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            estado: req.body.estado
        },
        contatos:{
            fixo: req.body.telFixo,
            celular: req.body.cel,
            email: req.body.email
        }
    })
    try{
        let novoCadastro = await cadastro.save()
        console.log("Cadastro realizado com sucesso.")
        res.redirect(`/cadastros/${novoCadastro.id}`)
    }catch(err){
        console.log(err)
        res.redirect('/cadastros/novo')
    }
})


router.get('/:id', async (req,res) => {
    try{
        //res.send("página do usuário cadastrado")
        let cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        let docs = await Docs.find({usuarioId: req.params.id}).exec()
        res.render('cadastros/ver', {cad: cad, docs:docs})
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/docs', async (req,res) => {
    try{
        const cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        res.render('cadastros/docsForm', {cad:cad})
    }catch{
        res.redirect('/'+req.params.id)
    }
})

router.post('/:id/docs', async (req,res) => {
    let docs = new Docs({
        usuarioId: req.params.id,
    })
    try{
        saveDocs(docs, req.body.rgFrente, 'rgFrente')
        saveDocs(docs, req.body.rgCosta, 'rgCosta')
        saveDocs(docs, req.body.cpfFrente, 'cpf')
        saveDocs(docs, req.body.compRes, 'compRes')
        const newDocs = await docs.save()
        //console.log(JSON.parse(req.body.rgFrente))
        res.redirect(`/cadastros/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})

router.delete('/:id', async (req,res) => {
    let cadas
    let docs
    try{
        cadas = await Cadastro.findById(req.params.id).exec()
        docs = await Docs.findOne({usuarioId: req.params.id}).exec()
        if(cadas && docs == null){
            await cadas.remove()
        }else if(cadas && docs){
            await cadas.remove()
            await docs.remove()
        }
        // console.log(cadas.id)
        // console.log(docs.id)
        res.redirect('/cadastros')
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${req.params.id}`)
    }
})

async function saveDocs(docs, docImg, docEntry){
    if(docImg == null) return
    const imgs = JSON.parse(docImg)
    if(imgs != null && imageMimeTypes.includes(imgs.type)){
        switch(docEntry){
            case 'rgFrente':
                docs.rgFrenteImagem = new Buffer.from(imgs.data, 'base64')
                docs.rgFrenteImagemTipo = imgs.type
                break;
            case 'rgCosta':
                docs.rgCostaImagem = new Buffer.from(imgs.data, 'base64')
                docs.rgCostaImagemTipo = imgs.type
                break;
            case 'cpf':
                docs.cpfImagem = new Buffer.from(imgs.data, 'base64')
                docs.cpfImagemTipo = imgs.type
                break;
            case 'compRes':
                docs.compResImagem = new Buffer.from(imgs.data, 'base64')
                docs.compResImagemTipo = imgs.type
                break;
        }
    }
}

module.exports = router