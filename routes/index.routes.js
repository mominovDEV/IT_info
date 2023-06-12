const { Router } = require("express");

const router = Router();

const dictionaryRoute = require("./dictionary.routes"); //
const categoryRoute = require("./category.routes"); //

router.get("/", (req, res) => {
  res.render(createViewPath("index"), { title: "Home", page_name: "home" });
});

router.use("/api/dictionary", dictionaryRoute);
router.use("/api/category", categoryRoute);

module.exports = router;
