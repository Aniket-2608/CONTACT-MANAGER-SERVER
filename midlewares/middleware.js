const {verify}=require('jsonwebtoken');
const User = require("../model/user_schema");
const dotenv=require('dotenv').config();
const validate=(req,res,next)=>{
    const tokenHeader=req.header('token');
    if(!tokenHeader){
        return res.status(400).json({error:"user not logged in"});
    }
    try{
        verify(tokenHeader,process.env.SECRET,async(err,decode)=>{
            if(err){
                return res.status(400).json({error:"Unauthorized"});
            }
            const user=await User.findOne({_id:decode.data});
            if(user){
                req.user=user._id;
                next();
            }else{
                res.status(400).json({error:"failed"});
            }
        });
    }catch(e){
        res.status(400).json({error:"Forbidden :red_circle::red_circle:"});
    }
}
module.exports={validate};