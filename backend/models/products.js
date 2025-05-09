const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    inStock: {
        type: Boolean,
        required: true
    },
    colorOptions: {
        type: [String]
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;