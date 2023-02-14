const Owner = require('../models/Owner')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all Owner
// @route GET /Owner
// @access Private

const getAllOwner = asyncHandler (async (req, res) => {
    const owners = await Owner.find().select('-password').lean()
    if (!owners?.length){
        return res.status(400).json({ message: 'No owners found'})
    }
    res.json(owners)
})

// @desc Create all Owner
// @route POST /Owner
// @access Private

const createNewOwner = asyncHandler(async (req, res) => {
    const { email, password, name} = req.body

    //confirm data
    if (!email || !password || !name){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await Owner.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'duplicate E-mail' })
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds. No one can see the password even in the database.

    const ownerObject = { email, "password": hashedPwd, name}

    // Create and store new owner
    const owner = await Owner.create(ownerObject)

    if (owner){ //created
        res.status(201).json({ message: `New Owner ${name} created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all Owner
// @route PATCH /Owner
// @access Private

const updateOwner = asyncHandler(async (req, res) => {
    const {id, email, password, name,} = req.body

    //confirm data
    if (!id || !email || !name){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const owner = await Owner.findById(id).exec()

    if (!owner){
        return res.status(400).json({ message: 'Owner not found'})
    }

    //check for duplicate
    const duplicate = await Owner.findOne({ email }).lean().exec()

    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({ message: 'Duplicate E-mail' })

    }

    owner.email = email
    owner.name = name

    if (password){
        //Hash password
        owner.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedOwner = await owner.save()

    res.json({ message:  `${updatedOwner.name} updated`})

})

// @desc Delete all Owner
// @route DELETE /Owner
// @access Private

const deleteOwner = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Owner ID Require'})
    }

    const owner = await Owner.findById(id).exec()

    if (!owner){
        return res.status(400).json({ message: 'Owner not found' })      
    }

    const result = await owner.deleteOne()

    const reply = `Owner Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllOwner,
    createNewOwner,
    updateOwner,
    deleteOwner
}