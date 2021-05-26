const express = require('express')
const router = express.Router({mergeParams:true})
const Cadastro = require('../models/usuarios')
const Docs = require('../models/documentos')
const fs = require('fs')
const sharp = require('sharp')

//Multer setup
const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const path = require('path')

// const filename = function (req, file, cb) {cb( null, date + '-' + file.fieldname + '.jpeg')}

const uploadPath = path.join( './public/', Docs.caminhoBaseDocs)

//const fileFilter = function (req, file, cb) {cb(null, imageMimeTypes.includes(file.mimetype))}


const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    fileFilter: imageMimeTypes
})


router.get('/', async (req,res) => {
    try{
        const cad = await Cadastro.findById(req.params.id).populate('usuario').exec()
        res.render('partials/docsForm', {cad:cad})
    }catch{
        res.redirect('/'+req.params.id)
    }
})

router.post('/', upload.any(), async (req,res) => {
    //Tentando criar uma lógica pra substituir documento se já existe 
    //ou criar se ainda não existe. Ainda não deu certo
    let docs = new Docs({
        usuarioId : req.params.id,
    })
    const date =  Date.now()
    const files = req.files
    let fieldname
    try{
        console.log("Criando novos documentos")
        for (file in files){
            
            fieldname = files[file].fieldname
            filename = date + '-' + fieldname + '.jpeg'
            fBuffer = files[file].buffer
            //console.log(path.join(uploadPath, filename))
            //fazendo upload com Sharp
            sharp(fBuffer)
                .resize(500)
                .toFormat('jpeg')
                .jpeg({quality:80})
                .toFile(path.join(uploadPath, filename))
            switch(fieldname){
                case 'rgFrente':
                    docs.rgFrenteImagem = filename;
                    break;
                case 'rgVerso':
                    docs.rgVersoImagem = filename;
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
        console.log(err)
        res.redirect('/')
    }
})

router.delete('/deletar', async (req,res) => {
    cad = await Cadastro.findById(req.params.id).populate('usuario')
    docs = await Docs.findOne({usuarioId: req.params.id})
    try{
        fs.unlink(docs.rgFrenteImagemPath, (err => {
            if (err) console.log(err);
            else{
                console.log(docs.rgFrenteImagemPath + " deletado com sucesso.")
            }
         }))
        fs.unlink(docs.cpfImagemPath, (err => {
            if (err) console.log(err);
            else{
                console.log(docs.cpfImagemPath + " deletado com sucesso.")
            }
        }))
        fs.unlink(docs.compResImagemPath, (err => {
            if (err) console.log(err);
            else{
                console.log(docs.compResImagemPath + " deletado com sucesso.")
            }
        }))
        if(docs.rgVersoImagem != null && docs.rgVersoImagem != ''){
            fs.unlink( docs.rgVersoImagemPath, (err => {
                if (err) console.log(err);
                else{
                    console.log(docs.rgVersoImagemPath + " deletado com sucesso.")
                }
            }))
        }
        
        await docs.remove()
        console.log(`Documentos de ${cad.nome.nomeCompleto} apagados com sucesso.`)
        res.redirect(`/cadastros/${req.params.id}`)

    }catch(err){
        console.log(err)
        res.redirect(`/cadastros/${req.params.id}`)
    }
})

module.exports = router