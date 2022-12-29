const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require("../models/user")


router.post("/", async (req, res) => {
    const { email, password } = req.body
    // 
    if (!email || !password) return res.status(400).json({ error: `All field are required` })

    //email validation
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailReg.test(email)) return res.status(400).json({ error: `Please Enter a valid email address` })
    try {
        const userExist = await User.findOne({ email });

        if (!userExist) return res.status(400).json({ error: "Invaild email or password" });

        const passwordMatch = await bcrypt.compare(
            password,
            userExist.password
        );
        if (!passwordMatch) return res.status(400).json({ error: "Invaild email or password" });

        const payload = { _id: userExist._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        return res.status(200).json({ token })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
});
router.post("/register", async (req, res) => {

    const { email, password } = req.body
    // 
    if (!email || !password) return res.status(400).json({ error: `All field are required` })
    //email validation
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailReg.test(email)) return res.status(400).json({ error: `Please Enter a valid email address` })

    //password validation
    if (password.length < 6) return res.status(400).json({ error: `Password must be atleast 6 characters length` })


    try {
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) return res.status(400).json({ error: `email [${email}] already exist, please try another one` })
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, password })

        //save the user
        const result = await newUser.save();
        result._doc.password = undefined;

        return res.status(201).json({ ...result._doc })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
});

module.exports = router;