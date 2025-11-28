const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'out_of_stock'],
        default: 'available'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cơm', foodSchema);