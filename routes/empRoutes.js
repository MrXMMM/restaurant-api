const express = require("express")
const router = express.Router()
const empController = require('../controllers/empController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(empController.getAllEmp)
    .post(empController.createNewEmp)
    .patch(empController.updateEmp)
    .delete(empController.deleteEmp)

module.exports = router