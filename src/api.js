const line = require('@line/bot-sdk')
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

const ACCESS_TOKEN = "i1pQkBiSb1u7xOjTy43W29S3GDfYCSxy76mY38kMZY2KsuxgeUXDvhjQLlSMMXKPcsjUJ82xzJGGQisZ0D2KNMzm5NwTZ0ZdBTb4Bf1uc61LVu0xU7V3r/q2O6uYFvBDwQv18SwaGVLPlSXCRuZn4AdB04t89/1O/w1cDnyilFU="
const SECRET_TOKEN = "5df738274847d01d22354ee989df341b"

const lineConfig = {
   channelAccessToken: ACCESS_TOKEN,
   channelSecret:SECRET_TOKEN
}


const client = new line.Client({
   channelAccessToken: ACCESS_TOKEN
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


const richmenu = {
   size: {
      width: 2500,
      height: 1686
   },
};

const handleEvent = async (event) => {
   const profile = await client.getProfile(event.source.userId)
   console.log("getProfile =>> ", profile)
   return client.createRichMenu(richmenu)
   // return client.replyMessage(event.replyToken,{
   //    type:'text',
   //    text:`ไง ${profile.displayName}`
   // })
}

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)
