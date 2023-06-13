const Joi = require("joi")

exports.authorValidation =(data)=>{
    const schema = Joi.object({
      author_first_name: Joi.string()
        .pattern(new RegExp("^[a-zA-Z]{2,50}$"))
        .required(),
      author_last_name: Joi.string()
        .pattern(new RegExp("^[a-zA-Z]{2,50}$"))
        .required(),

      author_nick_name: Joi.string().max(20),
      author_email: Joi.string().email(),
      author_phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
      author_password: Joi.string().max(20).min(6),
      confirm_password:Joi.ref("author_password")
    });
    return
}