const AddonCategory = require('../models/AddonCategory')
const Addon = require('../models/Addon')
const asyncHandler = require('express-async-handler')

// @desc Get all AddonC
// @route GET /AddonC
// @access Private

const getAllAddonC = asyncHandler (async (req, res) => {
    const AddonCategorys = await AddonCategory.find().lean()
    if (!AddonCategorys?.length){
        return res.status(400).json({ message: 'No AddonCategorys found'})
    }
    res.json(AddonCategorys)
})

// @desc Create all AddonC
// @route POST /AddonC
// @access Private

const createNewAddonC = asyncHandler(async (req, res) => {
    const { name, choose } = req.body

    //confirm data
    if (!name || !choose ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await AddonCategory.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'ชื่อหมวดหมู่ซ้ำ' })
    }

    const addonCObject = { name, choose }

    // Create and store new addonC
    const addonC = await AddonCategory.create(addonCObject)

    if (addonC){ //created
        res.status(201).json({ message: `New AddonCategory ${name} created` })
    }
    else{ //Not create
        res.status(400).json({ message: 'Invalid data recieved'})
    }
})
8
// @desc Update all AddonC
// @route PATCH /AddonC
// @access Private

const updateAddonC = asyncHandler(async (req, res) => {
    const {id, name, choose } = req.body

    //confirm data
    if (!id || !name || !choose){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const addonC = await AddonCategory.findById(id).exec()

    if (!addonC){
        return res.status(400).json({ message: 'AddonCategory not found'})
    }

    //check for duplicate
    const duplicate = await AddonCategory.findOne({ name }).lean().exec()

    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({ message: 'Duplicate Category Name' })

    }

    addonC.name = name
    addonC.choose = choose

    const updatedAddonC = await addonC.save()

    res.json({ message:  `${updatedAddonC.name} updated`})

})

// @desc Delete all AddonC
// @route DELETE /AddonC
// @access Private

const deleteAddonC = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id){
        return res.status(400).json({ message: 'AddonCategory ID Require'})
    }

    const addon = await Addon.findOne({ category: id }).lean().exec()
    if (addon){
        return res.status(400).json({ message: 'หมวดหมู่นี้ยังมีวัตถุดิบหรือตัวเลือกอยู่' })
    }

    const addonC = await AddonCategory.findById(id).exec()

    if (!addonC){
        return res.status(400).json({ message: 'AddonCategory not found' })      
    }

    const result = await addonC.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllAddonC,
    createNewAddonC,
    updateAddonC,
    deleteAddonC
}