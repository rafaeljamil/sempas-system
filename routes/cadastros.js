const express = require('express')
const router = express.Router()
const Cadastro = require('../models/usuario')
const Docs = require('../models/documentos')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Docs.caminhoBaseDocs)
const multer = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter : (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    } 
})

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
        console.log(cad)
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

// router.post('/busca', async (req,res) => {
//     let cad
//     try{
//         cad = await Cadastro.find({nomeCompleto, apelido, cpf: req.query.busca}).populate('usuario').exec()
//         res.render('index', {cad:cad})
//     }catch{
//         res.redirect('/')
//     }
// })

router.get('/:id', async (req,res) => {
    try{
        //res.send("página do usuário cadastrado")
        let cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        let docs = await Docs.findOne({usuarioId: req.params.id}).populate('documentos').exec()
        //console.log(docs)
        //console.log(docs.rgFrenteImagem)
        res.render('cadastros/ver', {cad:cad, docs:docs})
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

router.post('/:id/docs', upload.any(), async (req,res) => {
    let docs = new Docs({
        usuarioId : req.params.id,
    })
    const files = req.files
    //console.log(files)
    let filename
    let fieldname
    try{
        for (file in files){
            filename = files[file].filename
            fieldname = files[file].fieldname
            console.log(filename)
            console.log(fieldname)
            switch(fieldname){
                case 'rgFrente':
                    docs.rgFrenteImagem = filename;
                    break;
                case 'rgCosta':
                    docs.rgCostaImagem = filename;
                    break;
                case 'cpfFrente':
                    docs.cpfImagem = filename;
                    break;
                case 'compRes':
                    docs.compResImagem = filename;
                    break;
            }
        }
        const newDocs = docs.save()
        res.redirect('/cadastros/'+req.params.id)
    }catch{
        if(files != null){
            for (file in files){
                filename = files[file].filename
                fs.unlink(path.join(uploadPath, filename), err => {
                    if(err) console.err(err)
                })
            }
            
        }
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
        res.redirect(`/cadastros/${req.params.id}`)
    }catch{
        if (cad == null){
            res.redirect('/')
        }
        res.render('cadastros/editar', { cad:cad, errorMessage: "Erro ao editar cadastro." })
    }
})

router.delete('/:id', async (req,res) => {
    let cadas
    let docs
    try{
        cadas = await Cadastro.findById(req.params.id).exec()
        docs = await Docs.findOne({usuarioId: req.params.id}).exec() //o find() tava retornando undefined
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



module.exports = router