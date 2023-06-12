const {Router} = require("express")
const {  getDescriptions, getDescription} = require("../controllers/description.controller")

const router = Router()

router.get("/",getDescriptions)
router.get("/:id",getDescription)


module.exports = router