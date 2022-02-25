const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET} = require('../utils/configs');

module.exports = {
    validateRegisterUser: (requestBody) =>{
        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required().email(),
            gender: Joi.string().required(),
            password: Joi.string().required(),
            contactInfo: Joi.object({
                address: Joi.string().required(),
                phoneNumber: Joi.string().required()
            })
            //
        }).options({ abortEarly: false, allowUnknown: true })

        return schema.validate(requestBody);
    },
    validateLogin(requestBody) {
        const schema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }).options({ abortEarly: false, allowUnknown: true })

        return schema.validate(requestBody)
    },
    encryptPassword(plainText) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainText, salt);
    },
    async comparePassword(plainText, encrypedPassword) {
        const isMatch = await bcrypt.compareSync(plainText, encrypedPassword);
        return isMatch
    },
    jwtToken(payload, expiresIn) {
        return jwt.sign(payload, SECRET, {
          expiresIn,
        });
    },
    //
}