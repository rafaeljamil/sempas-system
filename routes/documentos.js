const express = require('express')
const router = express.Router({mergeParams:true})
const Cadastro = require('../models/usuario')
const Docs = require('../models/documentos')
const fs = require('fs')

//Multer setup
const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const path = require('path')
const { route } = require('./cadastros')
let date =  Date.now()
const filename = function (req, file, cb) {cb( null, date + '-' + file.fieldname + '.jpeg')}
const uploadPath = path.join( './public/', Docs.caminhoBaseDocs)
const destination = function (req, file, cb) {cb(null, uploadPath)}
const fileFilter = function (req, file, cb) {cb(null, imageMimeTypes.includes(file.mimetype))}
const storage = multer.diskStorage({filename, destination})
// const upload = multer({storage, fileFilter})
const upload = multer({
    storage: storage,
    fileFilter : fileFilter,
})


router.get('/', async (req,res) => {
    try{
        const cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        res.render('cadastros/docsForm', {cad:cad})
    }catch{
        res.redirect('/'+req.params.id)
    }
})

router.post('/', upload.any(), async (req,res) => {
    //Tentando criar uma lógica pra substituir documento se já existe 
    //ou criar se ainda não existe
    let docs = new Docs({
        usuarioId : req.params.id,
    })
    //console.log(docs)
    const files = req.files
    //console.log(files)
    let filename
    let fieldname
    try{
        // const getDocs = await Docs.find({usuarioId: req.params.id})
        // if(getDocs != null && getDocs != ''){
        //     await getDocs.remove()
        // }
        console.log("Criando novos documentos")
        for (file in files){
            filename = files[file].filename
            fieldname = files[file].fieldname
            //console.log(filename)
            //console.log(fieldname)
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
        const newDocs = await docs.save()
        console.log('Documentos anexados com sucesso.')
        res.redirect('/cadastros/'+req.params.id)
    }catch(err){
        if(files != null){
            for (file in files){
                filename = files[file].filename
                fs.unlink(path.join(uploadPath, filename), err => {
                    if(err) console.err(err)
                })
            }
        }
        console.log(err)
        res.redirect('/')
    }
})

router.delete('/deletar', async (req,res) => {
    cad = await Cadastro.findById(req.params.id).populate('usuario')
    docs = await Docs.findOne({usuarioId: req.params.id})
    let errors = []
    try{
        fs.unlink(docs.rgFrenteImagemPath, (err => {
            if (err) errors.append(err);
            else{
                console.log(docs.rgFrenteImagemPath + " deletado com sucesso.")
            }
         }))
        fs.unlink(docs.cpfImagemPath, (err => {
            if (err) errors.append(err);
            else{
                console.log(docs.cpfImagemPath + " deletado com sucesso.")
            }
        }))
        fs.unlink(docs.compResImagemPath, (err => {
            if (err) errors.append(err);
            else{
                console.log(docs.compResImagemPath + " deletado com sucesso.")
            }
        }))
        if(docs.rgCostaImagem != null && docs.rgCostaImagem != ''){
            fs.unlink( docs.rgCostaImagemPath, (err => {
                if (err) errors.append(err);
                else{
                    console.log(docs.rgCostaImagemPath + " deletado com sucesso.")
                }
            }))
        }
        if(errors.length > 0){
            console.log(errors)
            res.redirect(`/cadastros/${req.params.id}`)
        }else{
            await docs.remove()
            console.log(`Documentos de ${cad.nome.nomeCompleto} apagados com sucesso.`)
            res.redirect(`/cadastros/${req.params.id}`)
        }
    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${req.params.id}`)
    }
})

module.exports = router