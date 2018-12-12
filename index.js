const express = require('express');
const body = require('body-parser');
const app = express();

const port = process.env.PORT || 5000

app.use(body.json());
app.use(body.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send({status: 'OK JA',Method:'GET'});
    console.log('on Get');
});

app.post('/',(req, res) => {
    let body = req.body;
    let response = {
        status: "200",
        body: body
    }
    res.send(response);
    console.log(body);
    
    
});

app.listen(port,() =>{
    console.log(`Server listening on port ${port}`);
    
});