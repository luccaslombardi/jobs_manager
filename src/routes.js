const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
 data: {
  name: "Luccas Lombardi",
  avatar: "https://avatars.githubusercontent.com/u/49651834?v=4",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 75
 },
 controllers: {
  index(req, res){
   return res.render(views + "profile", {profile: Profile.data})
  },
  update(req,res) {

   const data = req.body

   const weeksPerYear = 52

   //média de semanas por mês && remoção das férias
   const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12 
   
   //total de horas trabalhadas na semana
   const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

   //quantidade de horas trabalhadas no mês
   const monthlyTotalHours = weekTotalHours * weeksPerMonth

   //valor da hora
   const valueHour = data["monthly-budget"] / monthlyTotalHours

   Profile.data = {
    ...Profile.data,
    ...req.body,
    "value-hour": valueHour
   }

   return res.redirect('/profile')
  }
 }
}

const Job = {
 data: [
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
 ],
 controllers: {
  index(req,res) {
    //ajustes no job
    const updatedJobs = Job.data.map((job) => {
     const remaining = Job.services.remainingDays(job)
     const status = remaining <= 0 ? 'done' : 'progress'
   
     return {
      ...job,
      remaining,
      status,
      budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
     }
    })
   
    return res.render(views + "index", {profile: Profile.data , jobs: updatedJobs})
   },
   create(req,res) {
    return res.render(views + "job")
   },
   save(req, res) {
    const lastId = Job.data[Job.data.length - 1]?.id || 0; 

    Job.data.push({
     id: lastId + 1,
     name: req.body.name,
     "daily-hours": req.body["daily-hours"],
     "total-hours": req.body["total-hours"],
     created_at: Date.now()  //atribuindo data de hoje
    })
    return res.redirect('/')
   },
   show(req, res) {
    const jobId = req.params.id
    const job = Job.data.find(job => Number(job.id) === Number(jobId))

    if(!job) {
     return res.send('Job não encontrado')
    }

    job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

    return res.render(views + "job-edit", { job })
   },
   update(req, res){
    const jobId = req.params.id
    const job = Job.data.find(job => Number(job.id) === Number(jobId))

    if(!job) {
     return res.send('Job não encontrado!')
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    }

    Job.data = Job.data.map(job => {
     if(Number(job.id) === Number(jobId)) {
      job = updatedJob
     }
     return job
    })

    res.redirect('/job/' + jobId)
   },
   delete(req, res) {
    const jobId = req.params.id

    Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

    return res.redirect('/')
   }
  },
  services:{
   remainingDays(job) {

    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(remainingDays)
    const dueDate = createdDate.setDate(dueDay) 
    const timeDiffInMs = dueDate - Date.now()
  
    //convertendo milissegundos em data 
    const dayInMs = 1000 * 60 * 60 * 24 
    const dayDiff = Math.floor(timeDiffInMs / dayInMs)
  
    return dayDiff
   },
   calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
  },
}

//Rotas get e set
routes.get('/', Job.controllers.index) 
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/job',  Job.controllers.create)
routes.post('/job', Job.controllers.save)



module.exports = routes;