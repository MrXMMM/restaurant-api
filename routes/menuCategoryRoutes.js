const express = require("express")
const router = express.Router()
const menuCategoryController = require('../controllers/menuCategoryController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(menuCategoryController.getAllMenuC)
    .post(menuCategoryController.createNewMenuC)
    .patch(menuCategoryController.updateMenuC)
    .delete(menuCategoryController.deleteMenuC)


module.exports = router