const Joi = require("joi");

const categoryschema = Joi.object({
  category_name: Joi.string()
    .min(2)
    .message("Kategory nomi 2 ta harfdan kam bulmasligi kerak")
    .max(244)
    .message("Kategory nomi 244 tadan kup bulmasligi kerak")
    .required()
    .message(""),
  parent_category_id: Joi.string().alphanum(),
});

module.exports = categoryschema;
