const { Router } = require("express");
const {
  addAuthor,
  getAllAuthors,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
} = require("../controllers/author.controller");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolise = require('../middleware/authorRolesPolise');
const Validator = require("../middleware/validator");
const router = Router();

router.route("/").get(authorPolice, getAllAuthors);
router.route("/").post(Validator("author"), addAuthor);
router.route("/login").post(Validator("author_email_pass"), loginAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);

module.exports = router;
