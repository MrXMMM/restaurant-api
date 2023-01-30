const Addon = require('../models/Addon')
const AddonCategory = require('../models/AddonCategory')
const asyncHandler = require('express-async-handler')

// @desc Get all Addon
// @route GET /Addon
// @access Private

const getAllAddon = asyncHandler (async (req, res) => {
    const addons = await Addon.find().lean()
    if (!addons?.length){
        return res.status(400).json({ message: 'No addons found'})
    }

    // Add addon to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const addonswithAddonCategory = await Promise.all(addons.map(async (addon) => {
        const addonCategory = await AddonCategory.findById(addon.category).lean().exec()
        return { ...addon, addonCategory: addonCategory.name }
    }))

    res.json(addonswithAddonCategory)
})

// @desc Create all Addon
// @route POST /Addon
// @access Private

const createNewAddon = asyncHandler(async (req, res) => {
    const { category, name, price } = req.body

    //confirm data
    if (!category || !name || price < 0 ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await Addon.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'ชื่อตัวเลือกหรือวัตถุดิบซ้ำ' })
    }

    const addonObject = { category, name, price}

    // Create and store new addon
    const addon = await Addon.create(addonObject)

    if (addon){ //created
        res.status(201).json({ message: `New Addon created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})

// @desc Update all Addon
// @route PATCH /Addon
// @access Private

const updateAddon = asyncHandler(async (req, res) => {
    const {id, category, name, price, status} = req.body

    //confirm data
    if (!id || !category || !name || price < 0 || typeof status != 'boolean'){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const addon = await Addon.findById(id).exec()

    if (!addon){
        return res.status(400).json({ message: 'Addon not found'})
    }

    addon.category = category
    addon.status = status
    addon.name = name
    addon.price = price

    const updatedAddon = await addon.save()

    res.json({ message:  `addon ${updatedAddon.name} updated`})

})

// @desc Delete all Addon
// @route DELETE /Addon
// @access Private

const deleteAddon = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'Addon ID Require'})
    }

    const addon = await Addon.findById(id).exec()

    if (!addon){
        return res.status(400).json({ message: 'Addon not found' })      
    }

    const result = await addon.deleteOne()

    const reply = `Addon Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllAddon,
    createNewAddon,
    updateAddon,
    deleteAddon
}