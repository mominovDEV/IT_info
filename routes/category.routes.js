const { Router } = require("express");
const {
  getCategories,
  getCategory,
  addCategory,
} = require("../controllers/category.controller");

const router = Router();
router.post("/", addCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);

module.exports = router;
