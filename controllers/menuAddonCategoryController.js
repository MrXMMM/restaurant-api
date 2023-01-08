const MenuAddonCategory = require('../models/MenuAddonsCategory')
const asyncHandler = require('express-async-handler')

// @desc Get all menuAddonCategorys 
// @route GET /menuAddonCategorys
// @access Private
const getAllMenuAddonCategorys = asyncHandler(async (req, res) => {
    // Get all menuAddonCategorys from MongoDB
    const menuAddonCategorys = await MenuAddonCategory.find().lean()

    // If no menuAddonCategorys 
    if (!menuAddonCategorys?.length) {
        return res.status(400).json({ message: 'No menuAddonCategorys found' })
    }

    res.json(menuAddonCategorys)
})

// @desc Create new menuAddonCategory
// @route POST /menuAddonCategorys
// @access Private
const createNewMenuAddonCategory = asyncHandler(async (req, res) => {
    const { menu, addon } = req.body

    // Confirm data
    if (!menu || !addon) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new employee 
    const menuAddonCategory = await MenuAddonCategory.create({ menu, addon })

    if (menuAddonCategory) { // Created 
        return res.status(201).json({ message: 'New menuAddonCategory created' })
    } else {
        return res.status(400).json({ message: 'Invalid menuAddonCategory data received' })
    }

})


// @desc Delete a menuAddonCategory
// @route DELETE /menuAddonCategorys
// @access Private
const deleteMenuAddonCategory = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'MenuAddonCategory ID required' })
    }

    // Confirm menuAddonCategory exists to delete 
    const menuAddonCategory = await MenuAddonCategory.findOne({ id }).exec()

    if (!menuAddonCategory) {
        return res.status(400).json({ message: 'MenuAddonCategory not found' })
    }

    const result = await menuAddonCategory.deleteOne()

    const reply = `MenuAddonCategory deleted`

    res.json(reply)
})

module.exports = {
    getAllMenuAddonCategorys,
    createNewMenuAddonCategory,
    deleteMenuAddonCategory
}
