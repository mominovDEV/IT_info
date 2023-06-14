const {Router} = require("express")
const { loginAdmin, addAdmin, getAdmins, getAdmin} = require("../controllers/admin.controller")

const router = Router()


router.get("/",getAdmins)
router.post("/",addAdmin)
router.post("/login",loginAdmin)
router.get("/:id",getAdmin)

module.exports = router