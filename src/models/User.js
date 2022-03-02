const mongoose = require('mongoose');
const validator = require('validator')
const {encryptPassword,comparePassword,jwtToken} = require('../services/UserService.js');
const  Genre = require('../models/BookGenre');

const {Schema,model} = mongoose;

const ContactSchema = new Schema({
    address:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    }
});

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    // username:{
    //     type:String,
    //     required:true,
    //     immutable:true,  //this makes it uneditable
    //     unique:true
    // },
    gender:{
        type:String,
        enum:["male","female"],
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            disallowdPassword = ["admin"]
            let userPassword = value.toLowerCase()
            if(disallowdPassword.includes(userPassword)){
                throw new Error(`password cannot contain "${userPassword}"`)
            }
        },
        // validate(value){
        //     if(value.toLowerCase().includes("password")){
        //         throw new Error("password cannot contain password")
        //     }
        // },

    },
    contactInfo:ContactSchema
    // token:[{
    //     token:{
    //         type:String,
    //         required:false
    //     }
    // }]
},{timestamps: true});

UserSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = encryptPassword(user.password)
    }
    next()
})

UserSchema.pre("remove",async function(next){
    const user = this;
    await Genre.deleteMany({user:user.id})
    next()
})

/**
 * static method are accessible on the model
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
UserSchema.statics.findByCredentials = async (email,password)=> {
    const authUser = await User.findOne({ email });
    if (!authUser) {
        throw new Error('unauthorized')
    }
    const authenticated = comparePassword(password, authUser.password);
    if (!authenticated) {
        throw new Error('unauthorized')
    }
    return authUser
}

/**
 * method are accessible on the instance of the model
 */
UserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const payload = {
        id: user._id,
        name:user.name,
        email:user.email,
        gender:user.gender,
        contactInfo:user.contactInfo
    }
    return jwtToken(payload,"1d")
}

UserSchema.methods.getPublicProfile = function(){
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.contactInfo._id
    return userObject;
}

// UserSchema.methods.toJSON = function(){
//     const user = this;
//     const userObject = user.toObject()
//     delete userObject.password
//     return userObject;
// }

UserSchema.virtual("genres",{
    ref:"Genre",
    localField: "_id",
    foreignField:"user"
})

const User = model('User', UserSchema)

module.exports = User
