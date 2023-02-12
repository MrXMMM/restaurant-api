const express = require("express")
const router = express.Router()
const menuController = require('../controllers/menuController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(menuController.getAllMenu)
    .post(menuController.createNewMenu)
    .patch(menuController.updateMenu)
    .delete(menuController.deleteMenu)


module.exports = router