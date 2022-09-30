const express = require('express')
const user = require('./routers/user')
const survey = require('./routers/survey')
const quest = require('./routers/quest')
const trades = require('./routers/trades')
const botmessage = require('./routers/botmessage')
const Database = require("./config/Database")
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express()

var corsOptions = { 
    origin: true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, PUT, PATCH, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Database()
db.connect()

app.get('/', (req, res) => {
    res.send('ODA User is Online')
})

app.use(express.json())
app.use('/user', user)
app.use('/survey', survey)
app.use('/quest', quest)
app.use('/botmessage', botmessage)
app.use('/trades', trades)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})