const mongoose = require('mongoose')

const MenuCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('MenuCategory', MenuCategorySchema)