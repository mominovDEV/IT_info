const Joi = require("joi");

const getFullName = (parent) =>
  parent.author_fullname + " " + parent.author_lastname;

exports.authorValidation = (data) => {
  const schema = Joi.object({
    author_firstname: Joi.string()
      .pattern(new RegExp("^[A-Za-z]+$"))
      .required(),
    author_lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
    author_fullname: Joi.string().default(getFullName),
    author_nickname: Joi.string().max(20).required(),
    author_password: Joi.string().min(6).max(20).required(),
    confirm_password: Joi.ref("author_password"),
    author_email: Joi.string().email().required(),
    author_phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
    author_info: Joi.string(),
    author_position: Joi.string(),
    author_photo: Joi.string().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    // gender: Joi.string().valid("male", "female"),
    // birth_date: Joi.date().less(new Date("2005-01-01")),
    // birth_year: Joi.number().min(1980).max(2005),
    // refered: Joi.boolean().required(),
    // referalDetails: Joi.when("refered", {
    //   is: true,
    //   then: Joi.string().min(3).required(),
    //   otherwise: Joi.string().min(3).optional(),
    // }),
    // codingLangs: Joi.array().items(Joi.string(), Joi.object()),
    // is_active: Joi.boolean().truthy("yes"),
  });
  return schema.validate(data, { abortEarly: false });
};
