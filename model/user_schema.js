const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId
const UserSchema  =  new Schema({
    email : {type: String, required :[true, "Email is required"] },
    password : {type : String, required : [true, "Password is required"]}
})
const user = mongoose.model("user_details", UserSchema)
module.exports = user