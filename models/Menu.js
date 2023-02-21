const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'MenuCategory'
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    explaination: {
        type: String
    },
    imageURL: {
        type: String
    }
})

module.exports = mongoose.model('Menu', MenuSchema)