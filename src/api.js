const line = require('@line/bot-sdk')
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()
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
app.use(express.json())

const messages = {}

const handleEvent = async (event) => {

    if(event.type === 'message'){
        if(!messages[event.source.userId]){
            messages[event.source.userId] = [event]
        }else{
            messages[event.source.userId].push(event)
        }
    }
    console.log('push messages => ',messages)
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

// const ACCESS_TOKEN = "v565wMs7RUOFeli0wfo0JP1c41EIOPL/Fux3V1GS7goKMmw/hlqyO5W+nxAyIBy/7fj3FOkxrGnHu2EDFRuojWRoa3Mpy/bQM1/NHx4Rb7KiJoVIKv7VxQZpxxK4R6jDGcrfcLU7MToXoCaxI5t9lgdB04t89/1O/w1cDnyilFU="
// const SECRET_TOKEN = "644edb2fc25ff6c9b5b728a2ef76cbd4"

//
// const lineConfig = {
//     channelAccessToken: ACCESS_TOKEN,
//     channelSecret: SECRET_TOKEN
// }


// const client = new line.Client({
//     channelAccessToken: ACCESS_TOKEN
// });


router.post('/webhook',async (req, res) => {
    // line.middleware(lineConfig)
    const events = req.body.events;
    console.log("event =>>>>", events)

    try {
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
        console.log('channelAccessToken => ',queryString['channelAccessToken'])
        const client = new line.Client({
            channelAccessToken: queryString['channelAccessToken']
        });
        for (const [key, value] of Object.entries(messages)){
            console.log({key})
            console.log({client})
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
        const body = req.body;
        console.log({body})

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
