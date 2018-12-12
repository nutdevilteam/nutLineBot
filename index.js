// Require Package
const express = require('express');
const body = require('body-parser');
const line = require('@line/bot-sdk');
// ---------

// initial
const app = express();
const port = process.env.PORT || 5000
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
const client = new line.Client({
    channelAccessToken: 'MHm28DZc7a8t33moD+hTAT/+1sXApAfEQXTF/l9VcaWDV+4DN73ZYqLoPwlih3RQZXJHw/k+B4UOchM8eCLU5lecuIy9+W8+0fFCh9jgAfuc735R7sBeWOY/ingTfluSLyMrBzj/0rtST209wZRk/AdB04t89/1O/w1cDnyilFU='
  });
// -------------

  

  
// Route
app.get('/', (req, res) => {
    res.send({status: 'OK JA',Method:'GET'});
    console.log('on Get');
});

app.post('/webhook',(req, res) => {
    console.log(`POST Body :`);
    console.log(req.body);

    if(Object.keys(req.body).length !== 0){
        let events = req.body.events;
        // ------- Param --------
        let replyToken = req.body.replyToken;
        let type = events.type;
        // -------------

        
        switch (type) {
            // event meassage text, sticker, picture
            case 'message':  
                const message = {
                    type: 'text',
                    text: 'Nut ma law Ja ^O^'
                };
                replyMessage(message,replyToken);
                break;
            // event add friend
            case 'follow':
                break;
            // event unfriend
            case 'unfollow':
                break;
            default:
                break;
        }



        //res.send({status: 'OK JA'});
    }else{
        console.log(`Bed Request (400) Body empty`);
        res.status(400).send({errorMessage: 'Body is empty'});
    }
    
});
// ------------

// --- function -------

const replyMessage = (replyToken, message) =>{
        client.replyMessage(replyToken, message)
        .then(() => {
        console.log(`---------- Reply is Success ----------`)
        })
        .catch((err) => {
        console.log(`!!Error : ${err}`);
        });
}

const pushMessage = (userId, message) =>{
    client.pushMessage(userId, message)
    .then(() => {
        console.log(`---------- Reply is Success ----------`)
    })
    .catch((err) => {
        console.log(`!!Error : ${err}`);
    });
}

app.listen(port,() =>{
    console.log(`Server listening on port ${port}`);
    
});