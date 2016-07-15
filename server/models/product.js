const make = require(`../priceHelpers.js`),
    moment = require(`moment`),
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
        type: Date,
        default: moment().toDate()
    },
    updatedAt: {
        type: Date,
        default: moment().toDate()
    }
});

// check if we can remote the self = this by using fat arrow funtion
productSchema.methods.updatePrice = function() {
    var self = this;
    make.pFin.findItemDetails(make.URL(self.SKU, self.site), (err, details) => {
        if (err) {
            return err;
        }
        self.prices.push({
            date: moment().toDate(),
            price: details.price
        });
        return self.save((saveErr, saveRes) => saveRes);
    });
};

module.exports = mongoose.model('Product', productSchema);