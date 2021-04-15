const express = require("express")
const server = express()
const routes = require("./routes")

//Usando tamplate engine
server.set('view engine', 'ejs') 

//habilita arquivos estatics
server.use(express.static("public"))

//usar req.body 
server.use(express.urlencoded({ extended: true }))

//conectando ao servidor na porta 3000
server.listen(3000, () => console.log('rodando na porta 3000'))

//chamando as rotas
server.use(routes)

