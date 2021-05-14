const express = require('express')
const router = express.Router({mergeParams:true})
const Cadastro = require('../models/usuarios')
const Visita = require('../models/visitas')
const Relatorio = require('../models/relatoriosSociais')
const pdf = require('pdfkit')
const fs = require('fs')
const path = require('path')
//const htmlToPdf = require('html-pdf-node')


const imagePath = path.resolve(__filename ,'../../public/images/')
//console.log(imagePath)

router.get('/', async (req,res) => {
    let visita = await Visita.findById(req.params.id)
    let cad = await Cadastro.findById(visita.usuarioId)
    let rel = await Relatorio.findOne({visitaId:visita.id})

    


    try{
        //let options = {format:"A4"}
        //let arq = rel.relatorio
        //let arquivo = {content: arq}
        //let relatorioTexto = htmlToPdf.generatePdf(arquivo, options).then(pdfbuffer => {return pdfbuffer})
        //console.log(relatorioTexto)
        const doc = new pdf()
        //const breaker = '_'
        const mes = cad.rg.dataEmissao.getMonth()+1
        //criar PDF
        console.log("Gerando documento...")
        doc.pipe(fs.createWriteStream('modelo.pdf'))
        doc.pipe(res)
        doc.image(imagePath + '/logo-sempas-trim.jpeg', 240,10, {scale: 0.15, align:'center'}).moveDown(2) //240,0,
        doc.fontSize(20).text("Relatório de visita ", {align:'center'}).moveDown(1)
        //doc.fontSize(12).text(breaker.repeat(20), {align:'center'})
        doc.fontSize(16).text('Identificação:')
        doc.fontSize(12).text(
            "Nome completo: " + cad.nome.nomeCompleto + ', '+ 
            'Apelido: ' + cad.nome.apelido + ', ' +
            'Nome da mãe: ' + cad.nomeMae + ', ' +
            'NIS: ' + cad.nis + ', ' +
            'RG: ' + cad.rg.numero + ', ' +
            'Órgão expedidor: ' + cad.rg.orgaoExpedidor.toUpperCase() + ', ' +
            'UF: ' + cad.rg.uf.toUpperCase() + ', ' +
            'Data de emissão: ' + cad.rg.dataEmissao.getDate()+'/'+mes+'/'+cad.rg.dataEmissao.getFullYear() + '. '
            ).moveDown(1)
        doc.fontSize(16).text('Endereço:')
        doc.fontSize(12).text(
            'Logradouro: ' + cad.endereco.logradouro + ', ' +
            'Complemento: ' + cad.endereco.complemento + ', ' +
            'Nº.: ' + cad.endereco.numero + ', ' +
            'CEP: ' + cad.endereco.cep + ', ' +
            'Bairro: ' + cad.endereco.bairro + ', ' +
            'Cidade: ' + cad.endereco.cidade + ', ' +
            'Estado: ' + cad.endereco.estado + '. ' 
        ).moveDown(1)
        doc.fontSize(16).text('Relatório da visita:')
        doc.fontSize(12).text(rel.relatorio)
        doc.end()
        console.log("Documento gerado com sucesso.")
    }
    catch(err){
        console.log(err)
        res.redirect(`/cadastros/${visita.usuarioId}/visitas/${visita.id}`)
    }

    //res.send("Rota de imprimir")
})


module.exports = router