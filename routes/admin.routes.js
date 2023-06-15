const {Router} = require("express")
const { loginAdmin, addAdmin, getAdmins, getAdmin} = require("../controllers/admin.controller")
const adminPolice = require("../middleware/adminPolice")

const router = Router()


router.get("/",adminPolice,getAdmins)
router.post("/",addAdmin)
router.post("/login",loginAdmin)
router.get("/:id",getAdmin)

module.exports = router