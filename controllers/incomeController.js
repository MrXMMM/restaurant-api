const Income = require('../models/Income')
const asyncHandler = require('express-async-handler')

// @desc Get all Income
// @route GET /Income
// @access Private

const getAllIncome = asyncHandler (async (req, res) => {
    const Incomes = await Income.find().lean()
    if (!Incomes?.length){
        return res.status(400).json({ message: 'No Incomes found'})
    }
    res.json(Incomes)
})

// @desc Create all Income
// @route POST /Income
// @access Private

const createNewIncome = asyncHandler(async (req, res) => {
    const { date, daily_income } = req.body

    //confirm data
    if (!date ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await Income.findOne({ date }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'วันที่ซ้ำ' })
    }

    const incomeObject = { date, daily_income }

    // Create and store new income
    const income = await Income.create(incomeObject)

    if (income){ //created
        res.status(201).json({ message: `New Income ${name} created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})
8
// @desc Update all Income
// @route PATCH /Income
// @access Private

const updateIncome = asyncHandler(async (req, res) => {
    const { date, daily_income } = req.body

    //confirm data
    if (!date|| !daily_income ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const income = await Income.findById(id).exec()

    if (!income){
        return res.status(400).json({ message: 'Income not found'})
    }

    //check for duplicate
    const duplicate = await Income.findOne({ date }).lean().exec()

    //Allow updates to the original user
    if (duplicate){
        return res.status(409).json({ message: 'Duplicate Category Name' })

    }

    income.date = date
    income.daily_income = daily_income

    const updatedIncome = await income.save()

    res.json({ message:  `${updatedIncome.name} updated`})

})

// @desc Delete all Income
// @route DELETE /Income
// @access Private

const deleteIncome = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Income ID Require'})
    }

    const income = await Income.findById(id).exec()

    if (!income){
        return res.status(400).json({ message: 'Income not found' })      
    }

    const result = await income.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
}) 

module.exports = {
    getAllIncome,
    createNewIncome,
    updateIncome,
    deleteIncome
}