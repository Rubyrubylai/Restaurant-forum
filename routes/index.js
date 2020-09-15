const restaurantController = require('../controllers/restaurantController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController.js')
const auth = require('../config/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
    //前台首頁
    app.get('/', auth.authenticated, (req, res) => { return res.redirect('/restaurants') })
    
    //前台餐廳相關路由
    //瀏覽所有餐廳
    app.get('/restaurants', auth.authenticated, restaurantController.getRestaurants)
    //最新動態
    app.get('/restaurants/feeds', auth.authenticated, restaurantController.getFeeds)
    //人氣餐廳
    app.get('/restaurants/top', auth.authenticated, restaurantController.getTopRestaurant)
    //瀏覽餐廳dashboard
    app.get('/restaurants/:id/dashboard', auth.authenticated, restaurantController.getDashboard)
    //瀏覽個別餐廳
    app.get('/restaurants/:id', auth.authenticated, restaurantController.getRestaurant)

    //新增評論
    app.post('/comments', auth.authenticated, commentController.postComment)
    //刪除評論
    app.delete('/comments/:id', auth.authenticated, commentController.deleteComment)

    //加到我的最愛
    app.post('/favorite/:restaurantId', auth.authenticated, userController.addFavorite)
    //移除我的最愛
    app.delete('/favorite/:restaurantId', auth.authenticated, userController.removeFavorite)
    
    //加到Like
    app.post('/like/:restaurantId', auth.authenticated, userController.addLike)
    //移除Like
    app.delete('/like/:restaurantId', auth.authenticated, userController.removeLike)

    //後台首頁
    app.get('/admin', auth.authenticatedAdmin, (req, res) => { return res.redirect('/admin/restaurants')})

    //後台餐廳相關路由
    //總覽
    app.get('/admin/restaurants', auth.authenticatedAdmin, adminController.getRestaurants)
    //新增餐廳頁面
    app.get('/admin/restaurants/create', auth.authenticatedAdmin, adminController.createRestaurant)
    //新增餐廳
    app.post('/admin/restaurants', auth.authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
    //編輯餐廳頁面
    app.get('/admin/restaurants/:id/edit', auth.authenticatedAdmin, adminController.editRestaurant)
    //瀏覽一筆
    app.get('/admin/restaurants/:id', auth.authenticatedAdmin, adminController.getRestaurant)
    //編輯餐廳
    app.put('/admin/restaurants/:id', auth.authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
    //刪除餐廳
    app.delete('/admin/restaurants/:id', auth.authenticatedAdmin, adminController.deleteRestaurant)

    //後台使用者相關路由
    //顯示使用者清單
    app.get('/admin/users', auth.authenticatedAdmin, adminController.getUsers)
    //修改使用者權限
    app.put('/admin/users/:id', auth.authenticatedAdmin, adminController.putUsers)

    //後台分類相關路由
    //瀏覽所有分類
    app.get('/admin/categories', auth.authenticatedAdmin, categoryController.getCategories)
    //新增一筆分類
    app.post('/admin/categories', auth.authenticatedAdmin, categoryController.postCategory)
    //編輯一筆分類頁面
    app.get('/admin/categories/:id', auth.authenticatedAdmin, categoryController.getCategories)
    //編輯一筆分類
    app.put('/admin/categories/:id', auth.authenticatedAdmin, categoryController.putCategory)
    //刪除一筆分類
    app.delete('/admin/categories/:id', auth.authenticatedAdmin, categoryController.deleteCategory)

    //使用者相關路由
    app.get('/signup', userController.signupPage)
    app.post('/signup', userController.signup)
    app.get('/signin', userController.signinPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
    app.get('/logout', userController.logout)

    //美食達人
    app.get('/users/top', auth.authenticated, userController.getTopUser)
    //追蹤
    app.post('/following/:userId', auth.authenticated, userController.addFollowing)
    //取消追蹤
    app.delete('/following/:userId', auth.authenticated, userController.removeFollowing)

    //瀏覽profile
    app.get('/users/:id', auth.authenticated, userController.getUser)
    //瀏覽編輯Profile頁面
    app.get('/users/:id/edit', auth.authenticated, userController.editUser)
    //編輯profile
    app.put('/users/:id', auth.authenticated, upload.single('image'), userController.putUser)
}