const { Router } = require("express");
const { addAuthor, getAllAuthors, loginAuthor, logoutAuthor } = require("../controllers/author.controller");
const authorPolice = require("../middleware/authorPolice");

const router = Router();

router.post("/", addAuthor);
router.get("/",authorPolice, getAllAuthors);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);





module.exports = router;
