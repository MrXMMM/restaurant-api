const Menu = require('../models/Menu')
const MenuCategory = require('../models/MenuCategory')
const asyncHandler = require('express-async-handler')

// @desc Get all Menu
// @route GET /Menu
// @access Private

const getAllMenu = asyncHandler (async (req, res) => {
    const menus = await Menu.find().lean()
    if (!menus?.length){
        return res.status(400).json({ message: 'No menus found'})
    }

    // Add menu to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const menuswithMenuCategory = await Promise.all(menus.map(async (menu) => {
        const menuCategory = await MenuCategory.findById(menu.category).lean().exec()
        return { ...menu, CategoryName : menuCategory.name }
    }))

    res.json(menuswithMenuCategory)
})

// @desc Create all Menu
// @route POST /Menu
// @access Private

const createNewMenu = asyncHandler(async (req, res) => {
    const { category, name, price, explaination} = req.body
    const imageURL = req.file? req.file.path : null
    const price_ = parseInt(price, 10)

    //confirm data
    if (!category || !name || !price_){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await Menu.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'duplicate Name' })
    }

    const menuObject = { category, name, price: price_, explaination, imageURL}

    // Create and store new menu
    const menu = await Menu.create(menuObject)

    if (menu){ //created
        res.status(201).json({ message: `New Menu created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all Menu
// @route PATCH /Menu
// @access Private

const updateMenu = asyncHandler(async (req, res) => {
    const {id, category, name, price, status, explaination} = req.body
    const imageURL = req.file? req.file.path : null
    let status_ = status
    if (typeof status != 'boolean'){
        status_ = status === 'true'? true : false
    }
    const price_ = parseInt(price, 10)

    //confirm data
    if (!id || !category || !name || !price_ || typeof status_ != 'boolean'){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const menu = await Menu.findById(id).exec()

    if (!menu){
        return res.status(400).json({ message: 'Menu not found'})
    }

    menu.category = category
    menu.status = status_
    menu.name = name
    menu.price = price_
    menu.explaination = explaination
    if (imageURL) menu.imageURL = imageURL

    const updatedMenu = await menu.save()

    res.json({ message:  `menu ${updatedMenu.name} updated`})

})

// @desc Delete all Menu
// @route DELETE /Menu
// @access Private

const deleteMenu = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Menu ID Require'})
    }

    const menu = await Menu.findById(id).exec()

    if (!menu){
        return res.status(400).json({ message: 'Menu not found' })      
    }

    const result = await menu.deleteOne()

    const reply = `Menu Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllMenu,
    createNewMenu,
    updateMenu,
    deleteMenu
}