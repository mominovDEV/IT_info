const { Router } = require("express");
const { addAuthor, getAllAuthors } = require("../controllers/author.controller");

const router = Router();

router.get("/", getAllAuthors);
router.post("/", addAuthor);


module.exports = router;
