    const PriceFinder = require(`price-finder`);

    const URL = (URL, site) => {
        switch (site) {
            case `amazon`:
                return /amazon/i.test(URL) ? URL : `https://www.amazon.com/gp/product/${URL}`;
            case `newegg`:
                return /newegg/i.test(URL) ? URL : `http://www.newegg.com/Product/Product.aspx?Item=${URL}`;
        }
    };

    const SKU = (URL, site) => {
        switch (site) {
            case `amazon`:
                return URL.length === 10 ? URL : URL.match(/(\/)([A-Z0-9]{10})($|\?|\/)/)[2];
            case `newegg`:
                return URL.length === 15 ? URL : URL.match(/(\?Item=)([A-Z0-9]{15})(&)/)[2];
        }
    };

    const pFin = new PriceFinder({
        retrySleepTime: 2000,
    });

    module.exports = {
        URL,
        SKU,
        pFin
    };