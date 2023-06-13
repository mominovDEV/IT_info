const { Router } = require("express");

const router = Router();

const dictionaryRoute = require("./dictionary.routes"); //
const categoryRoute = require("./category.routes"); //

router.use("/dictionary", dictionaryRoute);
router.use("/category", categoryRoute);

module.exports = router;
