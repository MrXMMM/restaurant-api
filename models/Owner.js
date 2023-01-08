const mongoose = require('mongoose')

const OwnerSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model('Owner', OwnerSchema)