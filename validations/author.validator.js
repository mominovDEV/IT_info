const Joi = require("joi");

const authorschema = Joi.object({
  author_firstname: Joi.string()
    // .pattern(new RegExp("^[A-Za-z]+$"))
    .required(),
  author_lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  author_fullname: Joi.string(),//.default(getFullName),
  author_nickname: Joi.string().max(20).required(),
  author_password: Joi.string().min(6).max(20).required(),
  confirm_password: Joi.ref("author_password"),
  author_email: Joi.string().email().required(),
  author_phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
  author_info: Joi.string(),
  author_position: Joi.string(),
  author_photo: Joi.string().default("/author/avatar.png"),
  is_expert: Joi.boolean().default(false),
});

module.exports = authorschema;
