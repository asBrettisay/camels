const Agenda = require(`agenda`),
    agenda = new Agenda({
        db: {
            address: `mongodb://127.0.0.1/agenda`
        }
    }),
    moment = require(`moment`),
    Product = require(`../models/product.js`);

agenda.define(`Update prices`, {
    priority: `medium`,
    concurrency: 10
}, function(job, done) {
    Product.find({
        updatedAt: {
            $lt: moment().subtract(12, `hours`).toDate()
        }
    }, (err, products) => {
        if (err || !products.length) {
            return err;
        }
        products.forEach(product => {
            product.updatePrice();
        });
    });
    done();
});

agenda.on(`ready`, function() {
    agenda.every(`60 minutes`, `Update prices`);
    agenda.start();
});