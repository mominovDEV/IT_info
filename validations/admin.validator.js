const Joi = require("joi");

const adminSchema = Joi.object({
  admin_name: Joi.string().required(),
  admin_email: Joi.string().email().required(),
  admin_password: Joi.string().required(),
  admin_is_active: Joi.boolean().default(false),
  admin_is_creator: Joi.boolean().default(false),
  admin_reg_data: Joi.date().default(new Date()),
});

module.exports = adminSchema;
