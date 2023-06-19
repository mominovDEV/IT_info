const { Router } = require("express");
const {
  addAuthor,
  getAllAuthors,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  getAuthorById,
} = require("../controllers/author.controller");
const { addTopic, updateTopic, deleteTopic } = require("../controllers/topic.controller");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolise = require("../middleware/authorRolesPolise");
const Validator = require("../middleware/validator");
const router = Router();

router.route("/").get(authorPolice, getAllAuthors);
router.route("/:id").get(authorRolesPolise(["READ"]), getAuthorById);
router.route("/").post(Validator("author"), addAuthor);
router.route("/login").post(Validator("author_email_pass"), loginAuthor);
router.route("logout").post(logoutAuthor);
router.route("/refresh").post(refreshAuthorToken);
router.route("/topic").post(Validator("topic"), authorPolice, addTopic);

router
  .route("/topic/:id")
  .put(authorPolice, updateTopic)
  .delete(authorPolice, deleteTopic
    );
module.exports = router;
