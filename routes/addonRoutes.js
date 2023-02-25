const express = require("express")
const router = express.Router()
const addonController = require('../controllers/addonController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(addonController.getAllAddon)
    .post(addonController.createNewAddon)
    .patch(addonController.updateAddon)
    .delete(addonController.deleteAddon)


module.exports = router