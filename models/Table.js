const mongoose = require('mongoose')

const TableSchema = new mongoose.Schema({
    table_num: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    customer_num: {
        type: Number,
        default: 4
    }
})

module.exports = mongoose.model('Table', TableSchema)