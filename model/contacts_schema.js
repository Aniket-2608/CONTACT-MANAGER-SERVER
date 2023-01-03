const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const contactSchema = new Schema({
    contact:[{
        Name :  String,
        Designation : String,
        Company : String,
        Industry : String,
        Email : String,
        PhoneNumber : Number,
        Country : String
    }],
    
    userId : {type :mongoose.Schema.Types.ObjectId, ref : "user"}
})
const contacts = mongoose.model("contact_details", contactSchema);
module.exports = contacts