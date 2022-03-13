const User = require('../models/User.js');
const UserService = require('../services/UserService.js');
const {formatResponseError} = require('../services/HelperService.js');
// const jwt = require('../helpers/jwt.js')

const userController = {
    getRegisteredUser: async (req,res)=>{
        try {
            let users = await User.find().select({
                password:0,
                __v:0,
                date:0,
                // contactInfo:{$name}
            })
            if(!users) return res.status(404).json({error:"user not found"});
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:users
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send(error);
        }
    },
    geRegisteredUserById: async (req,res)=> {
        try {
         const user = await User.findById(req.params.userId).select('-__v -createdAt -updatedAt');
         if(!user) return res.status(404).json({error:"user not found"});
         return res.status(200).json({
             status:200,
             message:"successfully processed",
             data:user.getPublicProfile()
         })
        } catch (error) {
             if (error.kind == 'ObjectId') {
                 return res.status(400).json({ error: 'Invalid user Id' });
             }
             return res.status(500).json({error});
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
                return {...acc,[key]:value.message}
            },{})
            return res.status(500).send(errorMsg);
        }
    },
    updateUser: async (req,res)=> {
        try {
            const { value, error } = UserService.validateRegisterUser(req.body);
            if(error) return res.status(400).json({error})
            const user = await User.findOneAndUpdate({ _id: req.user.id }, value, { new: true, runValidators:true });
            return res.status(200).json({
                status:200,
                message:"successfully updated",
                data:user
            });
        } catch (error) {
            console.error(error);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid book Id' });
            }
            return res.status(500).send({error});
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
             */
            const user = await User.findByCredentials(value.email,value.password);
            let token = await user.generateAuthToken()
            return res.status(200).json({ 
                success:true,
                user:user.getPublicProfile(),
                token
            });
          } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Invalid email or password' });
        }
   
    },
}

module.exports = userController;