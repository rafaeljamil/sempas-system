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
    try{
        for (file in files){
            let filename = files[file].filename
            let fieldname = files[file].fieldname
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
            fs.unlink(path.join(uploadPath, filename), err => {
                if(err) console.err(err)
            })
        }
        res.redirect('/')
    }
    // let docs = new Docs({
    //     usuarioId: req.params.id,
    // })
    // try{
    //     saveDocs(docs, req.body.rgFrente, 'rgFrente')
    //     saveDocs(docs, req.body.rgCosta, 'rgCosta')
    //     saveDocs(docs, req.body.cpfFrente, 'cpf')
    //     saveDocs(docs, req.body.compRes, 'compRes')
    //     const newDocs = await docs.save()
    //     //console.log(JSON.parse(req.body.rgFrente))
    //     res.redirect('/cadastros/'+req.params.id)
    // }catch(err){
    //     console.log(err)
    //     res.redirect('/')
    // }
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