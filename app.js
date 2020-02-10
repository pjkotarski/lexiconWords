
const express = require('express');
const wordRouter = require('./words/words');
const app = express();


app.get('/', (req, res)=>{
    res.send('welcome to your words api')
});

app.use('/api/words', wordRouter);


const PORT = process.env.PORT || 5000;
//this line above checks for either the environment variable for port or it adds 5000 if it's not there 

app.listen(PORT, () => console.log('server is running on port 5000'));
