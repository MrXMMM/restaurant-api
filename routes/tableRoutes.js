const express = require("express")
const router = express.Router()
const tableController = require('../controllers/tableController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(tableController.getAllTables)
    .post(tableController.createNewTable)
    .patch(tableController.updateTable)
    .delete(tableController.deleteTable)


module.exports = router