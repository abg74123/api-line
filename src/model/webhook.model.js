const {Client} = require('@line/bot-sdk')

export async function webhook(event){
    console.log("---MODEL | START FUNCTION webhook---")
    console.log("---event---",event)

    if(event.message.type === 'text'){
        switch (event.message.text) {
            case 'หนี้สินทั้งหมด':
                Client.replyMessage(event.replyToken,'จวย')
                break;
        
            default:
                break;
        }

    }
}