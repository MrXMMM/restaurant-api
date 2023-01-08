const express = require("express")
const router = express.Router()
const addonCategoryController = require('../controllers/addonCategoryController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(addonCategoryController.getAllAddonC)
    .post(addonCategoryController.createNewAddonC)
    .patch(addonCategoryController.updateAddonC)
    .delete(addonCategoryController.deleteAddonC)


module.exports = router