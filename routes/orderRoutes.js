const express = require("express")
const router = express.Router()
const orderController = require('../controllers/orderController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .get(orderController.getAllOrder)
    .post(orderController.createNewOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder)


module.exports = router