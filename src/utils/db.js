const mongoose = require('mongoose') 
const {MONGO_URI} = require('./configs.js')

const connectDB = async () => {
    try {
            mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            // useCreateIndex:true,
            // useFindAndModify:false
        })
        console.log("MongoDB connection successful")
    } catch (error) {
        // console.log(error)
        console.log("MongoDB connection Failed")
        process.exit(1)
    }
}

module.exports = connectDB;