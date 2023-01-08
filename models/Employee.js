const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    position:{
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    active: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('Employee', EmployeeSchema)