const express = require("express")
const router = express.Router()
const menuAddonCategoryController = require('../controllers/menuAddonCategoryController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(menuAddonCategoryController.getAllMenuAddonCategorys)
    .post(menuAddonCategoryController.createNewMenuAddonCategory)
    .delete(menuAddonCategoryController.deleteMenuAddonCategory)


module.exports = router