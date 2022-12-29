const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const routerUrl = require('./router')
const env = require('dotenv').config()
const port = 3000 || process.env.mongoose_url
const path = require('path')
const user = require('./model/user_schema')
const logRouter = require("./router")
mongoose.set('strictQuery', true)
// middleware
// app.use(express.json())
app.use(cors())
app.use("/", logRouter);
// app.use(express.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
mongoose.connect(process.env.mongoose_url)
app.listen(port, {useUnifiedTopology: true,useNewUrlParser: true},()=>{
    console.log("server connected")
})