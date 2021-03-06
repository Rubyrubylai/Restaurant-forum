const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

const pageLimit = 10

const restController = {
    getRestaurants: (req, res) => {
        let offset = 0
        let whereQuery = {}
        let categoryId = ''
        //若有點選分類
        if (req.query.categoryId) {
            categoryId = Number(req.query.categoryId)
            whereQuery['CategoryId'] = categoryId
        }
        //若有點選分頁
        if (req.query.page) {
            offset = (req.query.page - 1) * pageLimit
        }
        Restaurant.findAndCountAll({
            include: [Category],
            where: whereQuery,
            offset,
            limit: pageLimit
        })
        .then(result => {
            //分頁功能所需資料
            let pages = Math.ceil(result.count / pageLimit)
            let page = Number(req.query.page) || 1
            let prev = page - 1 < 1 ? 1 : page - 1
            let next = page + 1 > pages ? pages : page + 1
            let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
            //顯示在畫面上的餐廳資料
            const data = result.rows.map(r => ({
                ...r.dataValues,
                description: r.description.substring(0, 50),
                categoryName: r.Category.name,
                isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id), 
                isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
            }))
            Category.findAll({
                raw: true,
                nest: true
            })
            .then(categories => {
                return res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next })
            })
        })
    },

    getRestaurant: (req, res) => {
        Restaurant.findByPk(
            req.params.id,
            { include: [Category,
                { model: User, as: 'FavoritedUsers' },
                { model: User, as: 'LikedUsers' },
                { model: Comment, include: [User] }
            ] })
        .then(restaurant => {
            restaurant.increment('viewCounts').then(restaurant => {
                const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
                const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
                return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
            })
        })
    },

    getFeeds: (req, res) => {
        Restaurant.findAll({
            raw: true,
            nest: true,
            limit: 10,
            include: [Category],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(restaurants => {
            Comment.findAll({
                raw: true,
                nest: true,
                limit: 10,
                include: [User, Restaurant],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(comments => {
                return res.render('feeds', { restaurants, comments })
            })
        })
    },

    getDashboard: (req, res) => {
        Restaurant.findByPk(
            req.params.id,
            { include: [Category, Comment] })
        .then(restaurant => {
            return res.render('dashboard', { restaurant: restaurant.toJSON() })
        })
    },

    //人氣餐廳
    getTopRestaurant: (req, res) => {
        Restaurant.findAll({
            include: [{ 
                model: User, as: 'FavoritedUsers' 
            }]
        })
        .then(restaurants => {
            restaurants = restaurants.map(restaurant => ({
                ...restaurant.dataValues,
                description: restaurant.description.substring(0, 50),
                favoriteCounts: restaurant.FavoritedUsers.length,
                isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
            }))            
            restaurants = restaurants.sort((a, b) => b.favoriteCounts - a.favoriteCounts)
            restaurants = restaurants.slice(0, 10)
            return res.render('topRestaurant', { restaurants })
        })
    }
}

module.exports = restController