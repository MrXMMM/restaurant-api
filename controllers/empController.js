const Employee = require('../models/Employee')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all Emp
// @route GET /Emp
// @access Private

const getAllEmp = asyncHandler (async (req, res) => {
    const employees = await Employee.find().select('-password').lean()
    if (!employees?.length){
        return res.status(400).json({ message: 'No employees found'})
    }
    res.json(employees)
})

// @desc Create all Emp
// @route POST /Emp
// @access Private

const createNewEmp = asyncHandler(async (req, res) => {
    const { email, password, position, name, phone } = req.body

    //confirm data
    if (!email || !password || !position || !name || !phone){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await Employee.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'duplicate E-mail' })
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds. No one can see the password even in the database.

    const empObject = { email, "password": hashedPwd, position, name, phone}

    // Create and store new emp
    const emp = await Employee.create(empObject)

    if (emp){ //created
        res.status(201).json({ message: `New Employee ${name} created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all Emp
// @route PATCH /Emp
// @access Private

const updateEmp = asyncHandler(async (req, res) => {
    const {id, email, password, position, name, phone, active} = req.body

    //confirm data
    if (!id || !email || !position || !name || !phone){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const emp = await Employee.findById(id).exec()

    if (!emp){
        return res.status(400).json({ message: 'Employee not found'})
    }

    //check for duplicate
    const duplicate = await Employee.findOne({ email }).lean().exec()

    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({ message: 'Duplicate E-mail' })

    }

    emp.email = email
    emp.position = position
    emp.name = name
    emp.phone = phone
    emp.active = active

    if (password){
        //Hash password
        emp.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedEmp = await emp.save()

    res.json({ message:  `${updatedEmp.name} updated`})

})

// @desc Delete all Emp
// @route DELETE /Emp
// @access Private

const deleteEmp = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Employee ID Require'})
    }

    const note = await Note.findOne({ employee: id }).lean().exec()
    if (note){
        return res.status(400).json({ message: 'Employee has assigned notes' })
    }

    const emp = await Employee.findById(id).exec()

    if (!emp){
        return res.status(400).json({ message: 'Employee not found' })      
    }

    const result = await emp.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllEmp,
    createNewEmp,
    updateEmp,
    deleteEmp
}