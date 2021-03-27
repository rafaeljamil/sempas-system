const express = require('express')
const router = express.Router()
const Cadastro = require('../models/usuario')
const Docs = require('../models/documentos')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

router.get('/', (req,res) => {
    res.render("cadastros/index")
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
    // let docs = new Docs({
    //     usuarioId: req.params.id
    // })
    // let rgf = JSON.parse(req.body.rgFrente)
    // if (rgf != null && imageMimeTypes.includes(rgf.type)){
    //     docs.rgFrenteImagem = new Buffer.from(rgf.data, 'base64')
    //     docs.rgFrenteImagemTipo = rgf.type
    // }
    // let rgv = JSON.parse(req.body.rgVerso)
    // if (rgv != null && imageMimeTypes.includes(rgv.type)){
    //     docs.rgCostaImagem = new Buffer.from(rgv.data, 'base64')
    //     docs.rgCostaImagemTipo = rgv.type
    // }
    // let cpf = JSON.parse(req.body.cpfFrente)
    // if (cpf != null && imageMimeTypes.includes(cpf.type)){
    //     docs.cpfImagem = new Buffer.from(cpf.data, 'base64')
    //     docs.cpfImagemTipo = cpf.type
    // }
    // let compRes = JSON.parse(req.body.compRes)
    // if (compRes != null && imageMimeTypes.includes(compRes.type)){
    //     docs.compResImagem = new Buffer.from(compRes.data, 'base64')
    //     docs.compResImagemTipo = compRes.type
    // }
    try{
        //await docs.save()
        console.log(JSON.parse(req.body.rgFrente))
        res.redirect('/cadastros/'+req.params.id)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})



module.exports = router