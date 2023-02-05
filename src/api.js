const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

router.get('/webhook/line',(req,res)=>{
   console.log("webhook => ",req);
   res.json({
      message:'Webhook Event Success'
   })
})

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)