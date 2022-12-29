const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId

const UserSchema  =  new Schema({
    email : {type: String, unique : true, required : "Enter your valid email id"},
    password : {type : String, required : true, min : 6, max : 12}
})

const user = mongoose.model("User_Details", UserSchema)

module.exports = user