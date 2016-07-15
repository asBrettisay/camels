const agenda = require(`./agenda.js`),
    make = require(`../priceHelpers.js`),
    moment = require(`moment`),
    Product = require(`../models/product.js`);

const getProduct = (req, res) => {
    let {
        URL,
        site
    } = req.body;
    Product.findOne({
        SKU: make.SKU(URL, site)
    }, (err, product) => {
        if (!product) {
            make.pFin.findItemDetails(make.URL(URL, site), (err, details) => {
                Product.create({
                    SKU: make.SKU(URL, site),
                    URL: make.URL(URL, site),
                    prices: [{
                        date: moment().toDate(),
                        price: details.price
                    }],
                    name: details.name,
                    category: details.category,
                    site: site
                }, (newProdErr, newProd) => res.status(200).json(newProd));
            });
        } else {
            return res.status(200).json(product);
        }
    });
};

module.exports = {
    getProduct
};