const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  logout,
  refreshUserToken,
  activateLink,
  //   forgetPassword,
} = require("../controllers/user.controller");

const router = Router();
const userPolice = require("../middleware/userPolice");
const Validator = require("../middleware/validator");

router.get("/", getUsers);
router.post("/", Validator("user"), addUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/refresh", refreshUserToken);
// router.post("/forgetpassword", forgetPassword);
router.get("/:id", getUser);
router.get("/activate/:link", activateLink);
router.put("/:id", userPolice, Validator("user"), updateUser);
router.delete("/:id", userPolice, deleteUser);

module.exports = router;
