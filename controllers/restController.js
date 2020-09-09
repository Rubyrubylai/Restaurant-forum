const db = require('../models')
const Restaurant = db.Restaurant

const restController = {
    getRestaurants: (req, res) => {
        Restaurant.findAll({
            raw: true,
            nest: true
        })
        .then(restaurants => {
            return res.render('restaurants', { restaurants })
        })
        
    }
}

module.exports = restController