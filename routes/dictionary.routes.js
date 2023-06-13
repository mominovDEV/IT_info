const { Router } = require("express");
const {
  getDictionaries,
  getDictionary,
  getTermByLetter,
  addDictionary,
} = require("../controllers/dictionary.controller");

const router = Router();

router.post("/", addDictionary);
router.get("/", getDictionaries);
router.get("/:id", getDictionary);
router.get("/letter/:letter", getTermByLetter);

module.exports = router;
