const Validators = require("../validations/index");

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`${validator} validator doesn't exist`);
  }
  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (err.isJoi) {
        return res.status(400).send({
          message: err.message,
          friendlyMsg: "Validation error",
        });
      }
      return res.status(500).send({
        message: err.message,
        friendlyMsg: "Internal server error",
      });
    }
  };
};
