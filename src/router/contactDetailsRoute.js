const router = require("express").Router()
const bodyParser = require("body-parser");
const contactsModel = require("../Models/contacts_schema");
router.use(bodyParser.json());


router.get("/contacts",async(req,res)=>{
    try{
        const users = await contactsModel.find({userId:req.user});
        if(users.length){
            res.status(200).json({
                status:"success",
                users
            })
        }
        else{
            res.status(404).json({
                status:"failed",
            })
        }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
        })
    }
});

router.get("/contacts/:email",async(req,res)=>{
    try{

        const user = await contactsModel.findOne({Email:req.params.email});
        if(user.Email){
            res.status(200).json({
                status:"success",
                user
            })
        }
        else{
            res.status(404).json({
                status:"failed",
                message:"user does not exists"
            })
        }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})




module.exports = router