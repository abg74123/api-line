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

const client = new line.Client({
   channelAccessToken: env.ACCESS_TOKEN
});

router.post('/webhook',line.middleware(lineConfig),async (req,res)=>{
   try{
      const events = req.body.events
      console.log("event =>>>>",events)
      return events.length > 0 ? await events.map(item => handleEvent(item)) :  res.status(200).send("OK")
   }catch (err){
      res.status(500).end()
   }
})

const handleEvent = async (event) => {
   console.log(event)
   return client.replyMessage(event.replyToken,{
      type:'text',
      text:'Test'
   })
}

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)
