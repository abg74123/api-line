const line = require('@line/bot-sdk')
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()
const dotenv = require('dotenv')
const env = dotenv.config().parsed

const lineConfig = {
   channelAccessToken: env.ACCESS_TOKEN,
   channelSecret:env.SECRET_TOKEN
}

router.post('/webhook',line.middleware(lineConfig),(req,res)=>{
   console.log("### START WEBHOOK LINE ###");
   console.log("webhook => ",req);
   const events = req.body.events
   console.log("event =>>>>",events)
   // res.json({
   //    message:'Webhook Event Success'
   // })
})

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)
