const express = require('express')
const router = express.Router()
const Cadastro = require('../models/usuarios')
const Docs = require('../models/documentos')
const Visita = require('../models/visitas')
const docsRoute = require('../routes/documentos')
const visitasRoute = require('../routes/visitas')
// const fs = require('fs')

//A rota de cadastros estava ficando grande demais, então separei a rota /docs e /relatorio
router.use('/:id/docs', docsRoute) 
router.use('/:id/visitas', visitasRoute) 

//console.log(upload)

router.get('/', (req,res) => {
    res.render('cadastros', {cad:false})
})

router.get('/busca', async (req,res) => {
    //Antes era definido um objeto em Busca contendo o campo nome com valor igual ao RegExp
    //Não conseguia dar query no Banco de Dados usando find pra achar pelo nome, talvez porque
    //nome é um documento no BD, então encontrei na documentação do MongoDB que posso fazer busca
    //em campos internos usando ponto se colocar entre aspas e PAM, funcionou!
    let busca
    if (req.query.buscaNome != null && req.query.buscaNome != ''){
        busca = new RegExp(req.query.buscaNome, 'i')
    }
    try{
        const cad = await Cadastro.find({"nome.nomeCompleto": busca})
        //res.send("Buscou por:" + cad)
        //console.log(cad)
        res.render('cadastros/index', {cad:cad})
    }catch(err){
        if (busca == null || busca == ''){
            res.redirect('/cadastros', {cad:cad})
        }
        console.log(err)
        res.redirect('/')
    }
})

router.get('/novo', (req,res) => {
    res.render('cadastros/novo', {cad: new Cadastro()})
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
        console.log("Cadastro de "+ cadastro.nome.nomeCompleto +" realizado com sucesso.")
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
        let docs = await Docs.findOne({usuarioId: req.params.id}).populate('documentos').exec()
        let visita = await Visita.find({usuarioId: req.params.id}).populate('visitas').exec()
        //console.log(visita)
        //console.log(docs.rgFrenteImagem)
        res.render('cadastros/ver', {cad:cad, docs:docs, visita:visita, scope:""})
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/editar', async (req,res) => {
    let cad
    try{
        cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        res.render('cadastros/editar', {cad:cad})
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${req.params.id}`)
    }
})

router.put('/:id', async (req,res) => {
    let cad
    try{
        cad = await Cadastro.findById(req.params.id)
        cad.nome={
            nomeCompleto: req.body.nome, 
            apelido: req.body.apelido
        }
        cad.nomeMae = req.body.nomeMae,
        cad.nis = req.body.nis,
        cad.cpf = req.body.cpf,
        cad.rg = {
            numero: req.body.rg,
            orgaoExpedidor: req.body.orgao,
            uf: req.body.uf,
            dataEmissao: req.body.dataEmissao
        }
        cad.endereco = {
            logradouro: req.body.endereco,
            numero: req.body.numero,
            complemento: req.body.complemento,
            cep: req.body.cep,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            estado: req.body.estado
        }
        cad.contatos = {
            fixo: req.body.telFixo,
            celular: req.body.cel,
            email: req.body.email
        }
        await cad.save()
        console.log("Cadastro de "+ cad.nome.nomeCompleto +" editado com sucesso.")
        res.redirect(`/cadastros/${req.params.id}`)
    }catch{
        if (cad == null){
            res.redirect('/')
        }
        res.render('cadastros/editar', { cad:cad, errorMessage: "Erro ao editar cadastro." })
    }
})

router.delete('/:id/deletar', async (req,res) => {
    let cadas
    let docs
    let errors = []
    try{
        cadas = await Cadastro.findById(req.params.id).exec()
        docs = await Docs.findOne({usuarioId: req.params.id}).exec() //o find() tava retornando undefined
        if(cadas && docs == null){
            if(docs == null && docs == ''){
                await cadas.remove()
                res.redirect('/cadastros')
            }
        }else if(cadas && docs){
            console.log("Não pode remover cadastro que contém documentos")
            res.redirect(`/cadastros/${req.params.id}`)
            // fs.unlink(docs.rgFrenteImagemPath, (err => {
            //     if (err) errors.append(err);
            //     else{
            //         console.log(docs.rgFrenteImagemPath + " deletado com sucesso.")
            //     }
            //  }))
            // fs.unlink(docs.cpfImagemPath, (err => {
            //     if (err) errors.append(err);
            //     else{
            //         console.log(docs.cpfImagemPath + " deletado com sucesso.")
            //     }
            // }))
            // fs.unlink(docs.compResImagemPath, (err => {
            //     if (err) errors.append(err);
            //     else{
            //         console.log(docs.compResImagemPath + " deletado com sucesso.")
            //     }
            // }))
            // if(docs.rgCostaImagem != null && docs.rgCostaImagem != ''){
            //     fs.unlink( docs.rgCostaImagemPath, (err => {
            //         if (err) errors.append(err);
            //         else{
            //             console.log(docs.rgCostaImagemPath + " deletado com sucesso.")
            //         }
            //     }))
            // }
            // if(errors.length > 0){
            //     console.log(errors)
            //     res.redirect(`/cadastros/${req.params.id}`)
            // }else{
            //     await cadas.remove()
            //     await docs.remove()
            // }
        }

        // console.log(cadas.id)
        // console.log(docs.id)
        
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${req.params.id}`)
    }
})

module.exports = router