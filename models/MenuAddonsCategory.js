const mongoose = require('mongoose')

const MenuAddonCategorySchema = new mongoose.Schema({
    addon: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'AddonCategory'
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Menu'
    },
})

module.exports = mongoose.model('MenuAddonCategory', MenuAddonCategorySchema)