const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const OrderSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Table'
    },
    status: {
        type: Number,
        default: 0,
        require: true
    },
    price:{
        type: Number
    }
},
{
    timestamps: true
}
)

OrderSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'orderticketNums',
    start_seq: 1
})

module.exports = mongoose.model('Order', OrderSchema)