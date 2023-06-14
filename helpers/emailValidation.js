const Joi  = require("joi")
const emailValidation = (email) => {
    const q = Joi.string().email().validate(email);
    if (q.error) {
      console.log(q.error);
      return false;
    }
    return true;
  };

module.exports = emailValidation