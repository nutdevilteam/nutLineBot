// Require Package
const express = require('express');
const body = require('body-parser');
const mysql = require('mysql');
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

// connect mysql
const conn = mysql.createConnection({  // conn = connection
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'be30473f5ae74c',
  password : 'e7ea640a',
  port : 3306,
  database : 'heroku_4cdf996bba47287'
});

  

  
// Route
app.get('/', (req, res) => {
    res.send({status: 'OK JA',Method:'GET'});
    console.log('on Get');
});

app.get('/db', (req, res) => {
    // console.log(conn);
    conn.query('SELECT * from line_user_info', function (error, results, fields) {
    if (error) throw error;
        console.log('The solution is: ', results);
        let data = {
            status: 'connect_success',
            data:results
        }
        res.json(data);
    });
});

app.post('/push', (req, res) => {
    console.log(req.body);
    // if(req.body.length == 0){
    //     res.json({status: 'warring', message: 'Please send some data !!'});
    // }
    pushMessage(req.body.userId, req.body.message);
});

app.post('/webhook',async (req, res) => {
    // console.log(`POST Body :`);
    // console.log(req.body);

    if(Object.keys(req.body).length !== 0){
        let events = req.body.events[0];
        // ------- Param --------
        let replyToken = events.replyToken;
        let type = events.message.type;
        let message = events.message.text;
        let timeStamp = events.timestamp;
        let userId = events.source.userId
   
        // let checkUser = await checkUserById(userId);
        // var re = new RegExp("\R:");
        // console.log(re.test(message))
        // if(re.test(message)){
        //     let resCreateUser = await createUser(message, userId);
        //     if(checkUser.length > 0) {
        //         replyMessage(replyToken, `ท่านได้สมัครสมาชิกเรียบร้อยแล้ว`)
        //     } else{
        //         if(resCreateUser.status == 'error'){
        //             replyMessage(replyToken, resCreateUser.message)
        //         }else{
        //             replyMessage(replyToken, resCreateUser.message)
        //         }
        //     }

        // }else{
        //     if(checkUser.length === 0){
        //         replyMessage(replyToken, `คุณยังไม่ได้สมัครการใช้งาน Line Bot กรุณาพิมพ์ "R:firname:lastname" เพื่อทำการสมัครการใช้งาน`)
        //     }else {
                let getMessageReplys = await getMessageReply();
           
                let result = '';
                let num = 0;
                for(let i = 0; i < getMessageReplys.length; i++){
                    num++;
                    if(message.trim() == getMessageReplys[i].request_message.trim()){
                        result = getMessageReplys[i].reply_message;
                        break;
                    }else if(message == '--help'){
                        result = result + `${num}. ${getMessageReplys[i].request_message}\n`;
                    }else{
                        console.log('in')
                        let items = [`ตอนนี้น้องกำลังพัฒนาอยู่นะ ขอโทษด้วยครับ`, `keyword ไม่ตรงอ่าครับ T-T`, `น้องไม่เข้าใจ T-T`];
                        // result = `กรุณาพิมพ์ keyword ให้ตรงด้วยจ้า สามารถดู keyword ทั้งหมดได้โดยการพิมพ์ "--help"`
                        result = items[Math.floor(Math.random()*items.length)];
                    }
                    
                };
                replyMessage(replyToken, result.trim())
            // }

        // }

    }else{
        console.log(`Bed Request (400) Body empty`);
        res.status(400).send({errorMessage: 'Body is empty'});
    }
    
});
// ------------

// --- function -------

const replyMessage = (replyToken, message) =>{
        const resMessage = {
            type: 'text',
            text: message
        };
        client.replyMessage(replyToken, resMessage)
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

const getMessageReply = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * from line_reply_message where used = ?', ['1'], (error, results, fields)=>{
            if (error){
                reject(new Error("Error!" + error));
            }else {
                resolve(results);
            }
        });
    });
}

const createUser = (userinfo, userId) =>{
    let arr = userinfo.split(":");
    let json = {}
    if(arr[1] == undefined || arr[1] == ''){
        return {status:"error", message: "กรุณากรอก R:firname:lastname"}
    }else if(arr[2] == undefined || arr[2] == ''){
        return {status:"error", message: "กรุณากรอก lastname"}
    }else {
         return new Promise((resolve, reject) => {
            let insertData = {
                line_user_id : userId,
                first_name : arr[1],
                last_name : arr[2]
            }
            conn.query('INSERT INTO line_user_info SET ?', insertData, function (error, results, fields) {
                if (error){
                    reject(new Error("Error!" + error));
                }else {
                    resolve({status:"success", message: "แจ่มมาก"});
                }
            });
        });
    }
}

// const insertLogMessage = (data) => {
//     return new Promise((resolve, reject) => {
//         let insertData = {
//             line_user_id : userId,
//             first_name : arr[1],
//             last_name : arr[2]
//         }
//         conn.query('INSERT INTO line_user_info SET ?', insertData, function (error, results, fields) {
//             if (error){
//                 reject(new Error("Error!" + error));
//             }else {
//                 resolve({status:"success", message: "แจ่มมาก"});
//             }
//         });
//     });
// }

const checkUserById = (userId) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * from line_user_info where line_user_id = ?', [userId], (error, results, fields)=>{
            if (error){
                reject(new Error("Error!" + error));
            }else {
                resolve(results);
            }
        });
    });
}


// run server
app.listen(port,() =>{
    console.log(`Server listening on port ${port}`);
    
});