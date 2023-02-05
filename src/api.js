const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

router.get('/test',(req,res)=>{
   res.json({
    name:'boss'
   })
})

app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)