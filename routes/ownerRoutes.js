const express = require("express")
const router = express.Router()
const ownerController = require('../controllers/ownerController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(ownerController.getAllOwner)
    .post(ownerController.createNewOwner)
    .patch(ownerController.updateOwner)
    .delete(ownerController.deleteOwner)


module.exports = router