const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
    //使用者餐廳相關路由
    app.get('/', (req, res) => { return res.redirect('/restaurants') })
    app.get('/restaurants', restController.getRestaurants)

    //admin餐廳相關路由
    app.get('/admin', (req, res) => { return res.redirect('/admin/restaurants')})
    app.get('/admin/restaurants', adminController.getRestaurants)

    //使用者相關路由
    app.get('/signup', userController.signupPage)
    app.post('/signup', userController.signup)
    app.get('/signin', userController.signinPage)
    app.post('/signin',
        passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
    app.get('/logout', userController.logout)
}