const { Router } = require("express");

const router = Router();

const dictionaryRoute = require("./dictionary.routes"); //
const categoryRoute = require("./category.routes"); //
const authorRoute = require("./author.routes");
const adminRoute = require("./admin.routes");


router.use("/dictionary", dictionaryRoute);
router.use("/category", categoryRoute);
router.use("/author", authorRoute);
router.use("/admin", adminRoute);



module.exports = router;
