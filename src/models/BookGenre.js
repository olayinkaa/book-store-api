const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const GenreSchema = new Schema({
    name: {
        type:String,
        required:true
        // unique:false
    },
    description:String,
    userId:{
        type: Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: 'User'
    }, 
},{timestamps: true});


// GenreSchema.virtual("books",{
//     ref:"Booklist",
//     localField: "_id",
//     foreignField:"genre"
// })

module.exports = model('Genre',GenreSchema);