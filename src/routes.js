const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
 name: "Luccas Lombardi",
 avatar: "https://avatars.githubusercontent.com/u/49651834?v=4",
 "monthly-budget": 3000,
 "days-per-week": 5,
 "hours-per-day": 5,
 "vacation-per-year": 4
}

//rota padrão (index)
routes.get('/', (req, res) => {
 return res.render(views + "index", {profile})
}) 

//rota para job
routes.get('/job', (req, res) => {
 return res.render(views + "job")
})

//rota para job-edit
routes.get('/job/edit', (req, res) => {
 return res.render(views + "job-edit")
})

//rota para profile 
routes.get('/profile', (req, res) => {
 return res.render(views + "profile", {profile})
})

module.exports = routes;