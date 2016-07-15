const moment = require(`moment`),
    mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        unqiue: true
    },
    prices: [{
        price: {
            type: Number,
            min: 0
        },
        date: Date
    }],
    name: {
        type: String,
        required: true
    },
    category: String,
    site: String,
    createdAt: {
        type: {},
        default: moment().toDate()
    },
    updatedAt: {
        type: {},
        default: moment().toDate()
    }
});

module.exports = mongoose.model('Product', productSchema);