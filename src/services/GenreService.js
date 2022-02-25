const Joi = require('joi');

module.exports = {
    validateRequestBody: (requestBody) =>{
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required()
        }).options({abortEarly:false, allowUnknown:true})
        return schema.validate(requestBody);
    },
    //
}