const User = require('../models/User.js');
const UserService = require('../services/UserService.js');
const {formatResponseError} = require('../services/HelperService.js');
// const jwt = require('../helpers/jwt.js')

const userController = {
    getRegisteredUser: async (req,res)=>{
        try {
            const users = await User.find().select({
                password:0,
                __v:0,
                date:0
                // contactInfo:{$name}
            })
            if(!users) return res.status(404).json({error:"user not found"});
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:users
            })
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    registerUser: async (req,res) => {
        try {
            const { value, error } = UserService.validateRegisterUser(req.body);
            if(error) return res.status(400).json(formatResponseError(error))
            let user = await  User.findOne({email:value.email})
            if(user) return res.status(400).json({error:"email already taken"})
            user = new User(value);
            user = await user.save();
            if(!user) return res.status(400).json({error:"Unable to create user"})
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:user
            });
        } catch (error) {
            let errorMsg = Object.entries(error.errors).reduce((acc,[key,value])=>{
                return {
                    ...acc,
                    [key]:value.message
                }
            },{})
            return res.status(500).send(errorMsg);
        }
    },
    login: async (req,res) => {
        try {
            const { value, error } = UserService.validateLogin(req.body);
            if(error) return res.status(400).json(formatResponseError(error))
            /**
             * findByCredentials is a static method created on USER model
             * @param {string} email
             * @param {password} password
             * 
             * 
             */
            const user = await User.findByCredentials(value.email,value.password);
            let token = await user.generateAuthToken()
            return res.status(200).json({ 
                success:true,
                // user:user.getPublicProfile(),
                token
            });
          } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
   
    },
}

module.exports = userController;