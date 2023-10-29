const line = require('@line/bot-sdk')

export async function webhook(item) {
    console.log("--- ---MODEL | START FUNCTION webhook---")
    console.log("--- ---item---", item)
    try {
        const client = new line.Client({
            channelAccessToken: "xGCCFP74flkBjADem0hz6VoxoY/4bSGIlFfI9jzctGsVDMr8Fn1izevDyHT6pkTYEjPb/nR2ZpY8SgSTLx4HkjMJLHq+QWd0Ri6Ub+ry30yjTdw6jwYZ0Nv50vEQAijMpZJBAjzmQCQnw5cEiQR1jQdB04t89/1O/w1cDnyilFU="
        });
        if (item.message.type === 'text') {
            switch (item.message.text) {
                case 'หนี้สินทั้งหมด':
                    await client.replyMessage(item.replyToken, 'จวย')
                    break;
                default:
                    break;
            }

        }

    } catch (error) {
        console.log("--- ---error---", error)
    }
}