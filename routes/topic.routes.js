const {Router} = require("express")
const { addTopic, getTopics, getTopic, updateTopic, deleteTopic } = require("../controllers/topic.controller")

const router = Router()
const authorPolice = require("../middleware/authorPolice")
const Validators = require("../middleware/validator") 
router.get("/",getTopics)
router.post("/",authorPolice,Validators("topic"),addTopic)
router.get("/:id",getTopic)
// router.put("/:id",adminPolice,updateTopic)
// router.delete("/:id",adminPolice,deleteTopic)

module.exports = router