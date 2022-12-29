const mongoose= require('mongoose')
const connectDB= async()=>{
    return mongoose.connect("mongodb://localhost/contact").then(()=> console.log(`connecting to database`)).catch((err)=> console.log(err))
};
module.exports= connectDB;