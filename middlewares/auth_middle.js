const jwt = require('jsonwebtoken')
const User = require("../models/user");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) {
                return res.status(401).json({ err: "Unauthorized" })
            }
            try {
                const user = await User.findOne({ _id: payload._id }).select("-password");
                req.user = user;
                next();
            } catch (error) {
                console.log(error);
            }

        })
    } else {
        return res.status(403).json({ error: "Forbidden" })
    }
}