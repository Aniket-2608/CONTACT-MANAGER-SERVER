const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const contactSchema = new Schema({
    name : {type: String, required : true},
    designation : {type : String, required : true},
    company : {type : String, required : true},
    industry : {type : String, required : true},
    email : {type : String, required : true},
    phone : {type : Number, required : true},
    country : {type : String, required: true}
    // user : {type : ObjectId, ref : "user"}
})

const contacts = mongoose.model("Contact_Details", contactSchema);

module.exports = contacts