const mongoose = require('mongoose')

const TableSchema = new mongoose.Schema({
    table_num: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Table', TableSchema)