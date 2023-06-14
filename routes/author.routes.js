const { Router } = require("express");
const { addAuthor, getAllAuthors, loginAuthor } = require("../controllers/author.controller");

const router = Router();

router.post("/", addAuthor);
router.get("/", getAllAuthors);
router.post("/login", loginAuthor);




module.exports = router;
