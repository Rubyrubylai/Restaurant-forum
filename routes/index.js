const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {
    app.get('/', (req, res) => { return res.redirect('/restaurants') })

    app.get('/restaurants', restController.getRestaurants)

    app.get('/admin', (req, res) => { return res.redirect('/admin/restaurants')})

    app.get('/admin/restaurants', adminController.getRestaurants)
}