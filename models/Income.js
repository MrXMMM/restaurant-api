const mongoose = require('mongoose')

const IncomeSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    daily_income: {
        type: Number
    }
})

module.exports = mongoose.model('Income', IncomeSchema)