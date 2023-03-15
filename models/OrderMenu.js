const mongoose = require('mongoose')

const OrderMenuSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    menu_name: {
        type: String,
        require: true,
    },
    menu_price:{
        type: Number,
        require: true,
    },
    note: {
        type: String
    },
    quantity: {
        type: Number,
        require: true
    },
    addons: {
        type: [String]
    },
    addons_price: {
        type: Number
    },
})

module.exports = mongoose.model('OrderMenu', OrderMenuSchema)