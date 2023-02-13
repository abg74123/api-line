const line = require('@line/bot-sdk')
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()
const dotenv = require('dotenv')
const env = dotenv.config().parsed

const lineConfig = {
   channelAccessToken: 'i1pQkBiSb1u7xOjTy43W29S3GDfYCSxy76mY38kMZY2KsuxgeUXDvhjQLlSMMXKPcsjUJ82xzJGGQisZ0D2KNMzm5NwTZ0ZdBTb4Bf1uc61LVu0xU7V3r/q2O6uYFvBDwQv18SwaGVLPlSXCRuZn4AdB04t89/1O/w1cDnyilFU=',
   channelSecret:'5df738274847d01d22354ee989df341b'
}


const client = new line.Client({
   channelAccessToken: 'i1pQkBiSb1u7xOjTy43W29S3GDfYCSxy76mY38kMZY2KsuxgeUXDvhjQLlSMMXKPcsjUJ82xzJGGQisZ0D2KNMzm5NwTZ0ZdBTb4Bf1uc61LVu0xU7V3r/q2O6uYFvBDwQv18SwaGVLPlSXCRuZn4AdB04t89/1O/w1cDnyilFU='
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
