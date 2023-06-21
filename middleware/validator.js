const Validators = require("../validations/index");

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi) {
        return res.json(400, {
          message: err.message,
          friendlyMsg: "Validation error",
        });
      }
      return res.error(500, {
        friendlyMsg: "Internal Error",
      });
    }
  };
};
