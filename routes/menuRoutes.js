const express = require("express")
const router = express.Router()
const menuController = require('../controllers/menuController')
const verifyJWT = require('../middleware/verifyJWT')
const multer =require('multer')
const upload = multer({ dest: 'uploads/' })

//router.use(verifyJWT)

router.route('/')
    .get(menuController.getAllMenu)
    .post(upload.single('image'), menuController.createNewMenu)
    .patch(upload.single('image_edit'), menuController.updateMenu)
    .delete(menuController.deleteMenu)


module.exports = router