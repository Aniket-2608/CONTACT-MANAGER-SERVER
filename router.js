const express = require('express')
const router = require('express').Router();
const contacts = require('./model/contacts_schema')
const user = require('./model/user_schema')
router.use(express.json());
const cors = require('cors');

router.use(cors());
const {validate} = require("./midlewares/middleware")
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const {body,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.post('/register',body('email').isEmail(),body('password').isLength(min=6,max=12),async(req,res)=>{
    const {email,password}=req.body;
    try{
        const error=validationResult(req);
        if(!error.isEmpty()){
            res.status(500).json({error:error.array()});
        }
        const data=await user.findOne({email});
        if(data){
            return res.status(400).json({
                error:`user already exists with ${email} this email, try with another email`
            });
        }
        bcrypt.hash(password,12,async(err,hash)=>{
            if(err){
                return res.status(400).json({error:err.message});
            }
            const User = await user.create({email,password:hash});
            res.status(200).json({
                status:"success",
                message:"Registered Successfully"
            });
        });
    }catch(e){
        res.status(500).json({
            status:"failed",
            error:e.message
        });
    }
});
// login
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const userData=await user.findOne({email});
    if(userData != null){
        const result = await bcrypt.compare(password,userData.password);
        if(result){
            const token =jwt.sign(
            {
                exp:Math.floor(Date.now()/10)+60*60,
                data:userData._id
            },
            process.env.SECRET
            );
            res.status(200).json({
                status:"Login Successfully",
                token: token
            });
        }else{
            res.status(400).json({
                status:"failed",
                error:"Invalid email or password"
            });
        }
    }else{
        res.status(400).json({
            status:"failed",
            error:"User Not Found"
        });
    }
});
router.post('/create',validate,cors(),async(req,res)=>{
    try{
        let users=await contacts.find({userId:req.user});
        if(users.length>0){
            users=await contacts.find({userId:req.user}).updateOne(
                {},
                {
                    $push:{
                        contact:req.body
                    }
                }
            );
        }else{
            users=await contacts.create({
                contact:req.body,
                userId:req.user
            });
        }
        res.status(200).json({
            status:"success"
        });
        
    }catch(e){
        res.status(400).json({
            status:"failed",
            error:e.message
        });
    }
});
// GET USER
router.get('/user',validate,async(req,res)=>{
    try{
        const user=await user.findOne({_id:req.user});
        res.status(200).json({
            user
        });
    }catch(e){
        res.status(400).json({
            error:e.message
        });
    }
});
// GET ALL
router.get('/alluser',validate,async(req,res)=>{
    try{
        const users=await contacts.find({userId:req.user});
        res.status(200).json({
            users
        });
    }catch(e){
        res.status(400).json({
            error:e.message
        });
    }
});
// DELETE
router.delete('/delete/:id',validate,async(req,res)=>{
    try{
        let user=await contacts.updateOne({userId:req.user},{$pull:{contact:{_id:req.params.id}}});
        res.status(200).json({
            status:"success",
            user
        })
    }catch(e){
        res.status(400).json({
            status:"failed",
            error:e.message
        })
    }
});
module.exports=router