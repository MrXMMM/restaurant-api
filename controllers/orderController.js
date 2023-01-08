const Order = require('../models/Order')
const Table = require('../models/Table')
const asyncHandler = require('express-async-handler')

// @desc Get all Order
// @route GET /Order
// @access Private

const getAllOrder = asyncHandler (async (req, res) => {
    const orders = await Order.find().lean()
    if (!orders?.length){
        return res.status(400).json({ message: 'No orders found'})
    }

    // Add order to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const orderswithTable = await Promise.all(orders.map(async (order) => {
        const table = await Table.findById(order.table).lean().exec()
        return { ...order, table: table.table_num }
    }))

    res.json(orderswithTable)
})

// @desc Create all Order
// @route POST /Order
// @access Private

const createNewOrder = asyncHandler(async (req, res) => {
    const { table } = req.body

    //confirm data
    if (!table ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const orderObject = { table }

    // Create and store new order
    const order = await Order.create(orderObject)

    if (order){ //created
        res.status(201).json({ message: `New Order created`  })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all Order
// @route PATCH /Order
// @access Private

const updateOrder = asyncHandler(async (req, res) => {
    const {id, table, status} = req.body

    //confirm data
    if (!id || !table || !status){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const order = await Order.findById(id).exec()

    if (!order){
        return res.status(400).json({ message: 'Order not found'})
    }

    order.table = table
    order.status = status

    const updatedOrder = await order.save()

    res.json({ message:  `order updated`})

})

// @desc Delete all Order
// @route DELETE /Order
// @access Private

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Order ID Require'})
    }

    const order = await Order.findById(id).exec()

    if (!order){
        return res.status(400).json({ message: 'Order not found' })      
    }

    const result = await order.deleteOne()

    const reply = `Order Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllOrder,
    createNewOrder,
    updateOrder,
    deleteOrder
}