const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
 name: "Luccas Lombardi",
 avatar: "https://avatars.githubusercontent.com/u/49651834?v=4",
 "monthly-budget": 3000,
 "days-per-week": 5,
 "hours-per-day": 5,
 "vacation-per-year": 4,
 "value-hour": 75
}


const jobs = [
 {
 id: 1,
 name: "Pizzaria Guloso",
 "daily-hours": 50,
 "total-hours": 50,
 created_at: Date.now(),
 },
 {
  id: 2,
  name: "OneTwo Project",
  "daily-hours": 3,
  "total-hours": 47,
  created_at: Date.now(),
 }
 ]

 //função de calculo de datas e prazo dos jobs
 function remainingDays(job) {

  const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
  const createdDate = new Date(job.created_at)
  const dueDay = createdDate.getDate() + Number(remainingDays)
  const dueDate = createdDate.setDate(dueDay) 
  const timeDiffInMs = dueDate - Date.now()

  //convertendo milissegundos em data 
  const dayInMs = 1000 * 60 * 60 * 24 
  const dayDiff = Math.floor(timeDiffInMs / dayInMs)

  return dayDiff
 }


//rota padrão (index)
routes.get('/', (req, res) => {

 //ajustes no job
 const updatedJobs = jobs.map((job) => {
  const remaining = remainingDays(job)
  const status = remaining <= 0 ? 'done' : 'progress'

  return {
   ...job,
   remaining,
   status,
   budget: profile["value-hour"] * job["total-hours"]
  }
 })

 return res.render(views + "index", {profile, jobs: updatedJobs})
}) 

//rota get para job
routes.get('/job', (req, res) => {
 return res.render(views + "job")
})

//rota get para job-edit
routes.get('/job/edit', (req, res) => {
 return res.render(views + "job-edit")
})

//rota get para profile 
routes.get('/profile', (req, res) => {
 return res.render(views + "profile", {profile})
})

//rota post para job
routes.post('/job', (req, res) => {

 const lastId = jobs[jobs.length - 1]?.id || 1; 

 jobs.push({
  id: lastId + 1,
  name: req.body.name,
  "daily-hours": req.body["daily-hours"],
  "total-hours": req.body["total-hours"],
  created_at: Date.now()  //atribuindo data de hoje
 })
 return res.redirect('/')
})

module.exports = routes;