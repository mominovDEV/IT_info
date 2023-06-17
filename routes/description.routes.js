const {Router} = require("express")
const {  getDescriptions, getDescription, addDescription, updateDescription, deleteDescription} = require("../controllers/description.controller")

const router = Router()

router.post("/", addDescription);
router.get("/",getDescriptions)
router.get("/:id",getDescription)
router.put("/:id", updateDescription);
router.delete("/:id",deleteDescription)


module.exports = router