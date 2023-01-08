const mongoose = require('mongoose')

const AddonSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'AddonCategory'
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Addon', AddonSchema)