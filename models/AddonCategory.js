const mongoose = require('mongoose')

const AddonCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('AddonCategory', AddonCategorySchema)