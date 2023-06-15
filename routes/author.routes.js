const { Router } = require("express");
const { addAuthor, getAllAuthors, loginAuthor } = require("../controllers/author.controller");
const authorPolice = require("../middleware/authorPolice");

const router = Router();

router.post("/", addAuthor);
router.get("/",authorPolice, getAllAuthors);
router.post("/login", loginAuthor);




module.exports = router;
