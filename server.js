if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const ejsLayouts = require('express-ejs-layouts')
const indexRoute = require('./routes/index')
const cadRoute = require('./routes/cadastros')
const methodOverride = require('method-override')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser:true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Conectado com Mongoose. Banco: sempas-db"))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(ejsLayouts)
app.use('/public', express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:false, limit:'10mb'}))
app.use(methodOverride('_method'))

app.use('/', indexRoute)
app.use('/cadastros', cadRoute)

app.listen('3001', (req,res) => {
    console.log('Servidor iniciado. Porta: 3001')
})