const Joi = require("joi")

const userSchema = Joi.object({
        user_name:Joi.string()
        .required(),
        user_email:Joi.string().email()
        .required(),
        user_password:Joi.string()
        .min(5)
        .max(30)
        .required(),
        user_info:Joi.string()
        .default("New user"),
        user_photo:Joi.string()
        .default("/image/default.jpg/"),
        user_is_active:
            Joi.boolean()
            .default(false),
        user_activation_link:Joi.string()

    })

module.exports = userSchema
