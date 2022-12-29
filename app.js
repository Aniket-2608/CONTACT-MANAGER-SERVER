const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require("dotenv").config({ path: "./config/config.env" })

const auth = require("./middlewares/auth_middle")

const app = express();


//middleware
app.use(express.json());
app.use(morgan("tiny"));

//routes
app.get("/protected", auth, (req, res) => {
   return res.status(200).json({...req.user._doc })
})
app.use("/api/", require("./routes/auth"));


// server configurations
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
   await connectDB();
   console.log(`server running on ${PORT}`)
});