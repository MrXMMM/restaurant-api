const express = require("express")
const router = express.Router()
const orderMenuController = require('../controllers/orderMenuController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(orderMenuController.getAllOrderMenu)
    .post(orderMenuController.createNewOrderMenu)
    .patch(orderMenuController.updateOrderMenu)
    .delete(orderMenuController.deleteOrderMenu)


module.exports = router