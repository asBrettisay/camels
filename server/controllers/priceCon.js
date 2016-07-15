const Agenda = require(`agenda`),
    agenda = new Agenda({
        db: {
            address: `mongodb://127.0.0.1/agenda`
        }
    }),
    moment = require(`moment`),
    PriceFinder = require(`price-finder`),
    Product = require(`../models/product.js`);

agenda.define(`Update prices`, {
    priority: `medium`,
    concurrency: 10
}, function(job, done) {
    Product.findOne({
        updatedAt: {
            $lt: moment().subtract(20, `hours`).toDate()
        }
    }, (err, product) => {
        if (err || !product) {
            return err;
        }
        pFin.findItemDetails(makeURL(product.SKU, product.site), (err, details) => {
            if (err) {
                return err;
            }
            product.updatedAt = moment().toDate();
            product.prices.push({
                price: details.price,
                date: moment().toDate()
            });
            product.save((saveErr, saveRes) => saveRes);
        });
    });
    done();
});
agenda.on(`ready`, function() {
    agenda.every(`60 minutes`, `Update prices`);
    agenda.start();
});

const pFin = new PriceFinder({
    retrySleepTime: 2000,
});

const makeURL = (URL, site) => {
    switch (site) {
        case `amazon`:
            return /amazon/i.test(URL) ? URL : `https://www.amazon.com/gp/product/${URL}`;
        case `newegg`:
            return /newegg/i.test(URL) ? URL : `http://www.newegg.com/Product/Product.aspx?Item=${URL}`;
    }
};

const makeSKU = (URL, site) => {
    switch (site) {
        case `amazon`:
            return URL.match(/(\/)([A-Z0-9]{10})($|\?|\/)/)[2];
        case `newegg`:
            return URL.match(/(\?Item=)([A-Z0-9]{15})(&)/)[2];
    }
};

const getprice = (URL, site) => {
    pFin.findItemDetails(makeURL(URL, site), (err, details) => {
        return err ? err : details;
    });
};

module.exports = {
    getProduct: (req, res) => {
        let {
            URL,
            site
        } = req.body;
        Product.findOne({
            SKU: makeSKU(URL, site)
        }, (err, product) => {
            if (!product) {
                pFin.findItemDetails(makeURL(URL, site), (err, details) => {
                    Product.create({
                        SKU: makeSKU(URL, site),
                        prices: [{
                            date: new Date(),
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
    }
};