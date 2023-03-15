const OrderMenu = require('../models/OrderMenu')
const Order = require('../models/Order')
const Menu = require('../models/Menu')
const asyncHandler = require('express-async-handler')

// @desc Get all OrderMenu
// @route GET /OrderMenu
// @access Private

const getAllOrderMenu = asyncHandler (async (req, res) => {
    const orderMenus = await OrderMenu.find().lean()
    if (!orderMenus?.length){
        return res.status(400).json({ message: 'No orderMenus found'})
    }
    res.json(orderMenus)
})

// @desc Create all OrderMenu
// @route POST /OrderMenu
// @access Private

const createNewOrderMenu = asyncHandler(async (req, res) => {
    const { order, menu, menu_name, menu_price, note, quantity, addons, addons_price } = req.body

    //confirm data
    if (!order || !menu || !menu_name || !menu_price || !quantity ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const orderMenuObject = (!Array.isArray(addons) || !addons.length)
        ? { order, menu, menu_name, menu_price, note, quantity}
        : { order, menu, menu_name, menu_price, note, quantity, addons, addons_price }

    // Create and store new orderMenu
    const orderMenu = await OrderMenu.create(orderMenuObject)

    if (orderMenu){ //created
        res.status(201).json({ message: `New OrderMenu created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all OrderMenu
// @route PATCH /OrderMenu
// @access Private

const updateOrderMenu = asyncHandler(async (req, res) => {
    const {id, note, quantity, addons, addons_price} = req.body

    //confirm data
    if (!id || !quantity){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const orderMenu = await OrderMenu.findById(id).exec()

    if (!orderMenu){
        return res.status(400).json({ message: 'OrderMenu not found'})
    }

    orderMenu.note = note
    orderMenu.quantity = quantity
    orderMenu.addons = addons
    orderMenu.addons_price = addons_price

    const updatedOrderMenu = await orderMenu.save()

    res.json({ message:  `orderMenu updated`})

})

// @desc Delete all OrderMenu
// @route DELETE /OrderMenu
// @access Private

const deleteOrderMenu = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'OrderMenu ID Require'})
    }

    const orderMenu = await OrderMenu.findById(id).exec()

    if (!orderMenu){
        return res.status(400).json({ message: 'OrderMenu not found' })      
    }

    const result = await orderMenu.deleteOne()

    const reply = `OrderMenu deleted`

    res.json(reply)
})

module.exports = {
    getAllOrderMenu,
    createNewOrderMenu,
    updateOrderMenu,
    deleteOrderMenu
}