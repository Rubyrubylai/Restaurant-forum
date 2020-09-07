const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')

module.exports = app => {
    //使用者餐廳總覽
    app.get('/', (req, res) => { return res.redirect('/restaurants') })

    app.get('/restaurants', restController.getRestaurants)

    //admin餐廳總覽
    app.get('/admin', (req, res) => { return res.redirect('/admin/restaurants')})

    app.get('/admin/restaurants', adminController.getRestaurants)

    //註冊
    app.get('/signup', userController.signupPage)

    app.post('/signup', userController.signup)
}