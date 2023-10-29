const {Client} = require('@line/bot-sdk')

export async function webhook(item){
    console.log("---MODEL | START FUNCTION webhook---")
    console.log("---item---",item)

        if(item.message.type === 'text'){
            switch (item.message.text) {
                case 'หนี้สินทั้งหมด':
                    Client.replyMessage(item.replyToken,'จวย')
                    break;
                default:
                    break;
            }
    
        }


}