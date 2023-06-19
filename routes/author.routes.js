const { Router } = require("express");
const {
  addAuthor,
  getAllAuthors,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
} = require("../controllers/author.controller");
const authorPolice = require("../middleware/authorPolice");
const Validator = require("../middleware/validator");

const router = Router();

router.post("/", addAuthor);
router.get("/", authorPolice, getAllAuthors);
router.post("/login", Validator("author_email_pass"), loginAuthor);

router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);

module.exports = router;
