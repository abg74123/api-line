const {Client} = require('@line/bot-sdk')

export async function webhook(event){
    console.log("---MODEL | START FUNCTION webhook---")
    console.log("---event---",event)

    for (let index = 0; index < event.length; index++) {
        const element = event[index];
        console.log("---element---",element)
        if(element.message.type === 'text'){
            switch (element.message.text) {
                case 'หนี้สินทั้งหมด':
                    Client.replyMessage(element.replyToken,'จวย')
                    break;
                default:
                    break;
            }
    
        }
    }


}