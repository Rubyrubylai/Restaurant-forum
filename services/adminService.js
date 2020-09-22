const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res, callback) => {
      Restaurant.findAll({
          raw: true,
          nest: true,
          include: [Category]
      })
      .then(restaurants => {
        const email = req.user.email
          callback({ restaurants, email })
      })
  },

  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(
      req.params.id,
      { include: [Category] 
    })
    .then(restaurant => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },

  
}

module.exports = adminController