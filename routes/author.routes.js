const { Router } = require("express");
const {
  addAuthor, authorActivate,
  loginAuthor,
  deleteAuthor,
  refreshAuthorToken,
  logoutAuthor,
  updateAuthor,
  getAuthorById,
} = require("../controllers/author.controller");
const { activateLink } = require("../controllers/user.controller");
// const { addTopic, updateTopic, deleteTopic } = require("../controllers/topic.controller");
const authorPolice = require("../middleware/authorPolice");
// const authorRolesPolise = require("../middleware/authorRolesPolise");
const Validator = require("../middleware/validator");
const router = Router();


router.post("/",addAuthor)
router.get("/activate/:link", authorActivate);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.delete("/delete", authorPolice, deleteAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/logout", logoutAuthor);
router.get("/activate/:link", activateLink);
router.get("/:id", getAuthorById);
router.put("/:id", authorPolice, updateAuthor);


module.exports = router;
