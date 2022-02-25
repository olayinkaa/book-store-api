const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const GenreSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    description:String,
    user:{
        type: Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: 'User'
    }, 
},{timestamps: true});


module.exports = model('Genre',GenreSchema);