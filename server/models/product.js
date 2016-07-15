const make = require(`../priceHelpers.js`),
    moment = require(`moment`),
    mongoose = require(`mongoose`),
    sendMail = require(`./nodemailer.js`);

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
    URL: String,
    createdAt: {
        type: Date,
        default: moment().toDate()
    },
    updatedAt: {
        type: Date,
        default: moment().toDate()
    }
});

// check for price triggers and send emails every updated
// we should also do text, and have a field for type of notification, email or text
// const mailObj = {
//     to: [`bkemper@gmail.com`],
//     prodName: `poop bags and stuff`,
//     prodURL: `https://bkemper.me`,
//     prodPrice: `19.99`
// };
// sendMail(mailObj);

// check if we can remote the self = this by using fat arrow funtion
productSchema.methods.updatePrice = function() {
    var self = this;
    make.pFin.findItemDetails(self.URL, (err, details) => {
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