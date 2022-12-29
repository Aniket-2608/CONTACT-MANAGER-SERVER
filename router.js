
const express = require('express')
const csvtojson = require('csvtojson')
const multer = require('multer')
const secret ="abcdefghijk";
const user = require('./model/user_schema')
const contacts = require('./model/contacts_schema')
const bodyParser = require('body-parser');
const router = require('express').Router();
const jwt= require('jsonwebtoken');
const cors = require('cors');

router.use(express.json());
router.use(cors());

//register user...
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        let login = await user.find({ email, password });
        if (!login) {
            return res.status(409).json({
                status: "Failure",
                message: "No Account Exist"
            })
        }
        //if user already there compare the password
        if (login) {
            // Create a token after login
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: login._id
            },secret);
            return res.json({
                status: "Success",
                message: "Login Succesful",
                token
            })
        } else {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid credentials"
            })
        }
    }
    catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }
})
router.post('/signup', (req, res) => {
    const {password,email, confirmpassword} = req.body;
    const signupUser = new user({
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword
    })
    if (password !== confirmpassword) {
        res.send({
            message: "Password not matching with confirm password"
        })
    }
    
    signupUser.save()
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({
                message: err.message
            })
        })
})
router.get("/register",async(req,res)=>{
    try{
        const data= await user.find();
        res.status(200).json({
            status:"success",
            user:data
        })
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})

const csvFilePath = `${__dirname}/contact.csv`;
router.post('/add',(req,res)=>{
 //convert csvfile to jsonArray  
csvtojson()
.fromFile(csvFilePath)
.then(csvData =>{
    console.log(csvData);
    contacts.insertMany(csvData).then(()=>{
        console.log("Data Inserted");
        res.json({
            status:"Success"
        })
        .catch((err)=>{
            console.log(err);
            res.json({
                status:"Failure"
            })
        })
    })
})
});

router.get('/add',async(req,res)=>{
    try{
        const data = await contacts.find();
        res.status(200).json({
            status:"success",
            data
        })
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

router.delete("/add/:Id", async(req,res)=>{
    try{
        const data = await contacts.deleteOne({_id : req.params.Id}, req.body);
        res.json({
            status:"sucess",
            data
        })
    }
    catch(e){
        res.status(404).json({
            status:"Not Deleted",
            message:e.message
        })
    }
})

module.exports=router