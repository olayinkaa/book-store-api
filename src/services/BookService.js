const Joi = require('joi');

module.exports = {
    validateBookRequestBody: (requestBody) =>{
        const schema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().required(),
            imageUrl: Joi.string().required(),
            isbnNumber: Joi.string().required(),
            price: Joi.number().required(),
            language: Joi.string().required(),
            genre: Joi.string().required(),
            //
        }).options({ abortEarly: false, allowUnknown: true })

        return schema.validate(requestBody);
    },
}