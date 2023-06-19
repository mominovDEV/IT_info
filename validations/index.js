const author_email_pass = require("./author_email_pass.validator");
const author = require("./author.validator");

const admin = require("./admin.validator");

const user = require("./user.validator");
const topic = require("./topic.validator");


module.exports = {
  author_email_pass,
  author,
  admin,
  user,
  topic,
};
