const { Router } = require("express");

const router = Router();

const dictionaryRoute = require("./dictionary.routes"); //
const categoryRoute = require("./category.routes"); //
const authorRoute = require("./author.routes");

router.use("/dictionary", dictionaryRoute);
router.use("/category", categoryRoute);
router.use("/author", authorRoute);


module.exports = router;
