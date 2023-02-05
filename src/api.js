const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

router.get('/',(req,res)=>{
   res.json({
    name:'bossss'
   })
})

app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)