const express = require("express")
const router = express.Router()
const forgetPasswordController = require('../controllers/forgetPasswordController')

router.route('/').post(forgetPasswordController.ResetPassword)

module.exports = router