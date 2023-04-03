const line = require('@line/bot-sdk')
const cors = require('cors');
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

const handleEvent = async (event) => {

    if(event.type === 'message'){
        if(!messages[event.source.userId]){
            messages[event.source.userId] = [event]
        }else{
            messages[event.source.userId].push({
                event
            })
        }
    }
    // const profile = await client.getProfile(event.source.userId)
    // console.log("getProfile =>> ", profile)
    // return client.replyMessage(event.replyToken, [{
    //     "type": "template",
    //     "altText": "this is a buttons template",
    //     "template": {
    //         "type": "buttons",
    //         "thumbnailImageUrl": "https://img.salehere.co.th/p/1200x0/2021/12/28/x0tgsx1038bf.jpg",
    //         "imageAspectRatio": "rectangle",
    //         "imageSize": "cover",
    //         "imageBackgroundColor": "#B6AB1E",
    //         "title": "นกแก้ว",
    //         "text": "พันธุ์ทาง",
    //         "actions": [
    //             {
    //                 "type": "message",
    //                 "label": "ซื้อเลย",
    //                 "text": "ซื้อเลย"
    //             },
    //             {
    //                 "type": "message",
    //                 "label": "ยังไม่สนใจ",
    //                 "text": "ยังไม่สนใจ"
    //             }
    //         ]
    //     }
    // },
    //     {
    //         type: 'text',
    //         text: `ไง ${profile.displayName}`
    //     }
    // ])
}

const ACCESS_TOKEN = "i1pQkBiSb1u7xOjTy43W29S3GDfYCSxy76mY38kMZY2KsuxgeUXDvhjQLlSMMXKPcsjUJ82xzJGGQisZ0D2KNMzm5NwTZ0ZdBTb4Bf1uc61LVu0xU7V3r/q2O6uYFvBDwQv18SwaGVLPlSXCRuZn4AdB04t89/1O/w1cDnyilFU="
const SECRET_TOKEN = "5df738274847d01d22354ee989df341b"

const messages = {}

const lineConfig = {
    channelAccessToken: ACCESS_TOKEN,
    channelSecret: SECRET_TOKEN
}


// const client = new line.Client({
//     channelAccessToken: ACCESS_TOKEN
// });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

router.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events
        console.log("event =>>>>", events)
        return events && events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    } catch (err) {
        res.status(500).end()
    }
})

router.get('/list/users', async (req, res) => {
    console.log("messages => ",JSON.stringify(messages))
    const queryString = req.apiGateway?.event.queryStringParameters
    const users = []
    if(queryString && queryString['channelAccessToken']){

        for (const [key, value] of Object.entries(messages)){
            const client = new line.Client({
                channelAccessToken: queryString['channelAccessToken']
            });
            const profile = await client.getProfile(key)
            console.log("getProfile =>> ", profile)
            users.push(profile)
        }

        res.status(200).json({
            status: 200,
            data: users,
        })
    }else{
        res.status(404).json({
            status: 404,
            messages:'params channelAccessToken'
        })
    }

})

router.get('/messages/:userId', async (req, res) => {

    const queryString = req.apiGateway?.event.queryStringParameters
    const userId = req.params['userId']
    console.log({queryString})

    if(queryString && queryString['channelAccessToken']){


    const client = new line.Client({
        channelAccessToken: queryString['channelAccessToken']
    });

    for (const message of messages[userId]){
        const profile = await client.getProfile(userId)
        console.log("getProfile =>> ", profile)
        message['profile'] = profile
    }

    res.status(200).json({
        status: 200,
        data: messages[userId],
    })
    }else{
        res.status(404).json({
            status: 404,
            messages:'params channelAccessToken'
        })
    }

})

router.post('/broadcast/messages',async (req,res)=>{
    try{
        const body = JSON.parse(req.body.toString());

        const client = new line.Client({
            channelAccessToken: body.channelAccessToken
        });

        console.log({body})
      await client.broadcast(  {
            type: 'text',
            text: body.message
        })
        res.status(200).json({
            status: 200,
            message:"OK"
        })
    }catch (e) {
         res.status(500).json({
             status: 500,
            message:e
        })
    }
})

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)
