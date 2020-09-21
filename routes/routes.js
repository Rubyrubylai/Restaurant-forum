const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restaurantController = require('../controllers/restaurantController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController.js')
const auth = require('../config/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


//前台首頁
router.get('/', auth.authenticated, (req, res) => { return res.redirect('/restaurants') })

//前台餐廳相關路由
//瀏覽所有餐廳
router.get('/restaurants', auth.authenticated, restaurantController.getRestaurants)
//最新動態
router.get('/restaurants/feeds', auth.authenticated, restaurantController.getFeeds)
//人氣餐廳
router.get('/restaurants/top', auth.authenticated, restaurantController.getTopRestaurant)
//瀏覽餐廳dashboard
router.get('/restaurants/:id/dashboard', auth.authenticated, restaurantController.getDashboard)
//瀏覽個別餐廳
router.get('/restaurants/:id', auth.authenticated, restaurantController.getRestaurant)

//新增評論
router.post('/comments', auth.authenticated, commentController.postComment)
//刪除評論
router.delete('/comments/:id', auth.authenticated, commentController.deleteComment)

//加到我的最愛
router.post('/favorite/:restaurantId', auth.authenticated, userController.addFavorite)
//移除我的最愛
router.delete('/favorite/:restaurantId', auth.authenticated, userController.removeFavorite)

//加到Like
router.post('/like/:restaurantId', auth.authenticated, userController.addLike)
//移除Like
router.delete('/like/:restaurantId', auth.authenticated, userController.removeLike)

//後台首頁
router.get('/admin', auth.authenticatedAdmin, (req, res) => { return res.redirect('/admin/restaurants')})

//後台餐廳相關路由
//總覽
router.get('/admin/restaurants', auth.authenticatedAdmin, adminController.getRestaurants)
//新增餐廳頁面
router.get('/admin/restaurants/create', auth.authenticatedAdmin, adminController.createRestaurant)
//新增餐廳
router.post('/admin/restaurants', auth.authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
//編輯餐廳頁面
router.get('/admin/restaurants/:id/edit', auth.authenticatedAdmin, adminController.editRestaurant)
//瀏覽一筆
router.get('/admin/restaurants/:id', auth.authenticatedAdmin, adminController.getRestaurant)
//編輯餐廳
router.put('/admin/restaurants/:id', auth.authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
//刪除餐廳
router.delete('/admin/restaurants/:id', auth.authenticatedAdmin, adminController.deleteRestaurant)

//後台使用者相關路由
//顯示使用者清單
router.get('/admin/users', auth.authenticatedAdmin, adminController.getUsers)
//修改使用者權限
router.put('/admin/users/:id', auth.authenticatedAdmin, adminController.putUsers)

//後台分類相關路由
//瀏覽所有分類
router.get('/admin/categories', auth.authenticatedAdmin, categoryController.getCategories)
//新增一筆分類
router.post('/admin/categories', auth.authenticatedAdmin, categoryController.postCategory)
//編輯一筆分類頁面
router.get('/admin/categories/:id', auth.authenticatedAdmin, categoryController.getCategories)
//編輯一筆分類
router.put('/admin/categories/:id', auth.authenticatedAdmin, categoryController.putCategory)
//刪除一筆分類
router.delete('/admin/categories/:id', auth.authenticatedAdmin, categoryController.deleteCategory)

//使用者相關路由
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signinPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/logout', userController.logout)

//美食達人
router.get('/users/top', auth.authenticated, userController.getTopUser)
//追蹤
router.post('/following/:userId', auth.authenticated, userController.addFollowing)
//取消追蹤
router.delete('/following/:userId', auth.authenticated, userController.removeFollowing)

//瀏覽其他人的profile
router.get('/users/others/:id', auth.authenticated, userController.getOtherUser)
//瀏覽profile
router.get('/users/:id', auth.authenticated, userController.getUser)
//瀏覽編輯Profile頁面
router.get('/users/:id/edit', auth.authenticated, userController.editUser)
//編輯profile
router.put('/users/:id', auth.authenticated, upload.single('image'), userController.putUser)


module.exports = router