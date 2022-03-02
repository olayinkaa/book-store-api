const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const BookListSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:false
    },
    // imageUrl:{
    //     type:Buffer,
    //     // required:true,
    // },
    isbnNumber:{
        type:String,
        required:true,
        // immutable:true,  //this makes it uneditable
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    genreId:{
        type: Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: 'Genre'
    }, 
    // user:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required:true
    // },
},{timestamps: true});


module.exports = model('Booklist',BookListSchema);