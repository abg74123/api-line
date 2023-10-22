const line = require('@line/bot-sdk')
const axios = require('axios/dist/node/axios.cjs')
const express = require('express')
const serverless = require("serverless-http")
const app = new express()
const router = express.Router()

const lineDomain = "https://api.line.me/oauth2/v3"

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
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

    if (event.type === 'message') {
        if (!messages[event.source.userId]) {
            messages[event.source.userId] = [event]
        } else {
            messages[event.source.userId].push(event)
        }
    }
    console.log('push messages => ', messages)
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


router.post('/webhook', async (req, res) => {
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
    try {
        console.log("messages => ", JSON.stringify(messages))
        const queryString = req.apiGateway?.event.queryStringParameters
        const users = []
        const channelAccessToken = await getChannelAccessToken(queryString['client_id'], queryString['client_secret'])
        if (queryString && channelAccessToken) {
            console.log('channelAccessToken => ', channelAccessToken)
            const client = new line.Client({
                channelAccessToken: channelAccessToken
            });
            for (const [key, value] of Object.entries(messages)) {
                console.log({ key })
                console.log({ client })
                try {
                    const profile = await client.getProfile(key)
                    console.log("getProfile =>> ", profile)
                    users.push(profile)
                } catch (e) {
                    console.log("error  profile =>> ", JSON.stringify(e))
                }

            }

            res.status(200).json({
                status: 200,
                data: users,
            })
        } else {
            res.status(404).json({
                status: 404,
                messages: 'params channelAccessToken'
            })
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: e
        })
    }
})

router.get('/messages/:userId', async (req, res) => {
    try {
        const queryString = req.apiGateway?.event.queryStringParameters
        const userId = req.params['userId']
        console.log({ queryString })
        const channelAccessToken = await getChannelAccessToken(queryString['client_id'], queryString['client_secret'])
        if (queryString && channelAccessToken) {


            const client = new line.Client({
                channelAccessToken: channelAccessToken
            });

            for (const message of messages[userId]) {
                const profile = await client.getProfile(userId)
                console.log("getProfile =>> ", profile)
                message['profile'] = profile
            }

            res.status(200).json({
                status: 200,
                data: messages[userId],
            })
        } else {
            res.status(404).json({
                status: 404,
                messages: 'params channelAccessToken'
            })
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: e
        })
    }
})

router.get('/bot/info', async (req, res) => {
    try {
        const queryString = req.apiGateway?.event.queryStringParameters
        console.log({ queryString })
        const channelAccessToken = await getChannelAccessToken(queryString['client_id'], queryString['client_secret'])

        if (queryString && channelAccessToken) {


            const client = new line.Client({
                channelAccessToken: channelAccessToken
            });

            const botInfo = await client.getBotInfo()
            console.log("botInfo =>> ", botInfo)

            res.status(200).json({
                status: 200,
                data: botInfo,
            })
            console.log("bot info success")
        } else {
            res.status(404).json({
                status: 404,
                messages: 'params channelAccessToken'
            })
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: e
        })
    }
})

router.get('/bot/insight/followers', async (req, res) => {
    try {

        const queryString = req.apiGateway?.event.queryStringParameters
        console.log({ queryString })
        const channelAccessToken = await getChannelAccessToken(queryString['client_id'], queryString['client_secret'])

        if (queryString && queryString['date'] && channelAccessToken) {


            const client = new line.Client({
                channelAccessToken: channelAccessToken
            });

            const numberOfFollowers = await client.getNumberOfFollowers(queryString['date'])
            console.log("numberOfFollowers =>> ", numberOfFollowers)

            res.status(200).json({
                status: 200,
                data: numberOfFollowers,
            })
            console.log("numberOfFollowers success")
        } else {
            res.status(404).json({
                status: 404,
                messages: 'check params'
            })
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: e
        })
    }
})

router.post('/broadcast/messages', async (req, res) => {
    try {
        const body = req.body;
        console.log({ body })
        const channelAccessToken = await getChannelAccessToken(body.client_id, body.client_secret)

        const client = new line.Client({
            channelAccessToken
        });

        console.log({ body })
        await client.broadcast({
            type: 'text',
            text: body.message
        })
        res.status(200).json({
            status: 200,
            message: "OK"
        })
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: e
        })
    }
})

router.post('/validate/token', async (req, res) => {
    console.log("req.body => ",req.body)
    const { client_id, client_secret, access_token } = req.body;

    if (client_id && client_secret && access_token) {
        console.log("access_tokenssss => ",access_token)
        try {
            const channelAccessToken = await getChannelAccessToken(client_id, client_secret)
            const respVerifyAccessToken = await verifyAccessToken(access_token)

            console.log("validate [channelAccessToken]=> ", channelAccessToken)
            console.log("validate [respVerifyAccessToken]=> ", respVerifyAccessToken)
            if (channelAccessToken) {
                res.status(200).json({
                    status: 200,
                    messages: 'channelAccessToken is verifire'
                })
                console.log("numberOfFollowers success")
            }
        } catch (e) {
            console.log("error => ", e)
            res.status(500).json({
                status: 500,
                message: 'validate error'
            })
        }
    }else {
        console.warn('XXX params not complete!! XXX');
        res.status(400).json({
            status: 400,
            statusText: "BAD REQUEST",
            message: "",
        });
    }

})

const verifyAccessToken = async (token) => {
    console.log("--- FUNC | verifyAccessToken---")
    const { data: { access_token, expires_in } } = await axios.get(`${lineDomain}/verify`,{access_token:token})

    console.log("access_token => ", access_token)
    console.log("expires_in => ", expires_in)
    return access_token
}

const getChannelAccessToken = async (client_id, client_secret) => {
    console.log("--- FUNC | getChannelAccessToken---")
    // const oAuth = new line.OAuth()
    const { data: { access_token, expires_in } } = await axios.post(`${lineDomain}/token`, {
        client_id,
        client_secret,
        grant_type: 'client_credentials'
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // const {access_token} = await oAuth.issueAccessToken(client_id, client_secret)
    console.log("access_token => ", access_token)
    console.log("expires_in => ", expires_in)
    return access_token
}

// https://thunderous-dodol-b30b53.netlify.app/.netlify/functions/api
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)

