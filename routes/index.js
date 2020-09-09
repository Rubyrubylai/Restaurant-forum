const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const auth = require('../config/auth')

module.exports = (app, passport) => {
    //使用者相關路由
    app.get('/', auth.authenticated, (req, res) => { return res.redirect('/restaurants') })
    //使用者餐廳相關路由
    app.get('/restaurants', auth.authenticated, restController.getRestaurants)
    // app.get('/restaurant/:id', auth.authenticated, restController.getRestaurant)
    // app.post('/restaurant', auth.authenticated, restController.postRestaurant)
    // app.put('/restaurant/:id', auth.authenticated, restController.editRestaurant)
    // app.delete('/restaurant/:id', auth.authenticated, restController.deleteRestaurant)


    //admin相關路由
    app.get('/admin', auth.authenticatedAdmin, (req, res) => { return res.redirect('/admin/restaurants')})
    
    //admin餐廳相關路由
    //總覽
    app.get('/admin/restaurants', auth.authenticatedAdmin, adminController.getRestaurants)
    //瀏覽一筆
    app.get('/admin/restaurants/:id', auth.authenticatedAdmin, adminController.getRestaurant)
    //新增餐廳頁面
    app.get('/admin/restaurants/create', auth.authenticatedAdmin, adminController.createRestaurant)
    //新增餐廳
    app.post('/admin/restaurants', auth.authenticatedAdmin, adminController.postRestaurant)
    //編輯餐廳頁面
    // app.get('/admin/restaurant/edit', auth.authenticatedAdmin, adminController.editRestaurant)
    // //編輯餐廳
    // app.put('/admin/restaurant/:id', auth.authenticatedAdmin, adminController.putRestaurant)
    // //刪除餐廳
    // app.delete('/admin/restaurant/:id', auth.authenticatedAdmin, adminController.deleteRestaurant)

    //使用者相關路由
    app.get('/signup', userController.signupPage)
    app.post('/signup', userController.signup)
    app.get('/signin', userController.signinPage)
    app.post('/signin',
        passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
    app.get('/logout', userController.logout)
}