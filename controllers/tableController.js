const Table = require('../models/Table')
const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')

// @desc Get all tables 
// @route GET /tables
// @access Private
const getAllTables = asyncHandler(async (req, res) => {
    // Get all tables from MongoDB
    const tables = await Table.find().lean()

    // If no tables 
    if (!tables?.length) {
        return res.status(400).json({ message: 'No tables found' })
    }

    res.json(tables)
})

// @desc Create new table
// @route POST /tables
// @access Private
const createNewTable = asyncHandler(async (req, res) => {
    const { table_num, status } = req.body

    // Confirm data
    if (!table_num) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //check for duplicate
    const duplicate = await Table.findOne({ table_num }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'duplicate Table' })
    }

    // Create and store the new employee 
    const table = await Table.create({ table_num, status })

    if (table) { // Created 
        return res.status(201).json({ message: 'New table created' })
    } else {
        return res.status(400).json({ message: 'Invalid table data received' })
    }

})

const updateTable = asyncHandler(async (req, res) => {
    const {id, status} = req.body

    //confirm data
    if (!id || typeof status != 'boolean'){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const table = await Table.findById(id).exec()

    if (!table){
        return res.status(400).json({ message: 'Table not found'})
    }


    table.status = status

    const updatedTable = await table.save()

    res.json({ message:  `${updatedTable.table_num} updated`})

})

// @desc Delete a table
// @route DELETE /tables
// @access Private
const deleteTable = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Table ID required' })
    }

    const table_find = await Table.findById(id).exec()
    
    if (table_find.status === false){
        return res.status(400).json({ message: `เนื่องจากยังไม่ได้ชำระเงิน` })
    }

    // Confirm table exists to delete 
    const table = await Table.findById(id).exec()

    if (!table) {
        return res.status(400).json({ message: 'Table not found' })
    }

    const result = await table.deleteOne()

    const reply = `Table ${result.table_num} deleted`

    res.json(reply)
})

module.exports = {
    getAllTables,
    createNewTable,
    updateTable,
    deleteTable
}
