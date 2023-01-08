const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const NoteSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Employee'
    },
    title: {
        type: String,
        require: true
    },
    text:{
        type: String,
        require: true
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

NoteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Note', NoteSchema)