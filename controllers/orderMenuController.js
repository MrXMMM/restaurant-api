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

    // Add orderOrderMenu to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const orderMenuswithOrder = await Promise.all(orderMenus.map(async (orderMenu) => {
        const menu = await Menu.findById(orderMenu.menu).lean().exec()
        return { ...orderMenu, menu_name: menu.name, menu_price: menu.price }
    }))

    res.json(orderMenuswithOrder)
})

// @desc Create all OrderMenu
// @route POST /OrderMenu
// @access Private

const createNewOrderMenu = asyncHandler(async (req, res) => {
    const { menu, table, note, quantity, addons, addons_price } = req.body

    //confirm data
    if (!menu || !table || !quantity ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const orderMenuObject = (!Array.isArray(addons) || !addons.length)
        ? { menu, table, note, quantity }
        : { menu, table, note, quantity, addons, addons_price }

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
    const {id, order, menu, note, quantity, addons, addons_price} = req.body

    //confirm data
    if (!id || !order || !menu || !quantity ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const orderMenu = await OrderMenu.findById(id).exec()

    if (!orderMenu){
        return res.status(400).json({ message: 'OrderMenu not found'})
    }

    orderMenu.order = order
    orderMenu.menu = menu
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