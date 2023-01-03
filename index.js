const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const routerUrl = require('./router')

app.use(cors())
app.use(express.json());
const logRouter = require("./router")
const user = require('./model/user_schema')

const port = 3000 || process.env.mongoose_url

mongoose.set('strictQuery', true)

app.use("/", logRouter);
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect(process.env.mongoose_url,{useUnifiedTopology: true,useNewUrlParser: true}).then(()=>{
    console.log("DB Connected");
})
app.listen(port, ()=>{
    console.log("server connected")
})