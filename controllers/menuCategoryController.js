const MenuCategory = require('../models/MenuCategory')
const Menu = require('../models/Menu')
const asyncHandler = require('express-async-handler')

// @desc Get all MenuC
// @route GET /MenuC
// @access Private

const getAllMenuC = asyncHandler (async (req, res) => {
    const MenuCategorys = await MenuCategory.find().lean()
    if (!MenuCategorys?.length){
        return res.status(400).json({ message: 'No MenuCategorys found'})
    }
    res.json(MenuCategorys)
})

// @desc Create all MenuC
// @route POST /MenuC
// @access Private

const createNewMenuC = asyncHandler(async (req, res) => {
    const { name } = req.body

    //confirm data
    if ( !name ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await MenuCategory.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'duplicate Category Name' })
    }

    const menuCObject = { name }

    // Create and store new menuC
    const menuC = await MenuCategory.create(menuCObject)

    if (menuC){ //created
        res.status(201).json({ message: `New MenuCategory ${name} created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all MenuC
// @route PATCH /MenuC
// @access Private

const updateMenuC = asyncHandler(async (req, res) => {
    const {id, name } = req.body

    //confirm data
    if (!id || !name ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const menuC = await MenuCategory.findById(id).exec()

    if (!menuC){
        return res.status(400).json({ message: 'MenuCategory not found'})
    }

    //check for duplicate
    const duplicate = await MenuCategory.findOne({ name }).lean().exec()

    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({ message: 'Duplicate Category Name' })

    }

    menuC.name = name

    const updatedMenuC = await menuC.save()

    res.json({ message:  `${updatedMenuC.name} updated`})

})

// @desc Delete all MenuC
// @route DELETE /MenuC
// @access Private

const deleteMenuC = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'MenuCategory ID Require'})
    }

    const menu = await Menu.findOne({ category: id }).lean().exec()
    if (menu){
        return res.status(400).json({ message: 'ในหมวดหมู่นี้มีเมนูอยู่' })
    }

    const menuC = await MenuCategory.findById(id).exec()

    if (!menuC){
        return res.status(400).json({ message: 'MenuCategory not found' })      
    }

    const result = await menuC.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllMenuC,
    createNewMenuC,
    updateMenuC,
    deleteMenuC
}