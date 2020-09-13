const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

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
                categoryName: r.Category.name           
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
                { model: Comment, include: [User] }
            ] })
        .then(restaurant => {
          return res.render('restaurant', { restaurant: restaurant.toJSON() })
        })
    }
}

module.exports = restController