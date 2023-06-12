const { Router } = require("express");
const {
  getDictionaries,
  getDictionary,
  getTermByLetter,
} = require("../controllers/dictionary.controller");

const router = Router();
// const adminPolice = require("../middleware/adminPolice")
// const Validators = require("../middleware/validator");

router.get("/", getDictionaries);
// router.post("/", Validators("dictionary"), addDictionary);
router.get("/:id", getDictionary);
router.get("/letter/:letter", getTermByLetter);

module.exports = router;
