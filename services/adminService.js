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
      { include: [Category] }
    )
    .then(restaurant => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },

  deleteRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.destroy().then(restaurant => {
            callback({ status: 'success', message: '' })
        })
    })
  },

  postRestaurant: (req, res, callback) => {
    const { name, CategoryId, tel, address, opening_hours, description } = req.body
    if (!name) {
      callback({ status: 'error', message: 'name column cannot be blank' })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId
        })
        .then (restaurant => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })        
      })
    }
    else {
      Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId
      })
      .then (restaurant => {
        console.log(restaurant)
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },
  
  putRestaurant: (req, res, callback) => {
    const { name, CategoryId, tel, address, opening_hours, description } = req.body  
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.error(err)    
        Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant.update({
            name,
            CategoryId,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link: restaurant.image
          })
          .then(restaurant => {
            if (!name) {
              callback({ status: 'error', message: 'name column cannot be blank'})
            }
            else {
              callback({ status: 'success', message: 'restaurant was successfully updated'})
            }  
          })
        }) 
      })  
    }
    else {
      Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name,
          CategoryId,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image
        })
        .then(restaurant => {
          if (!name) {
            callback({ status: 'error', message: 'name column cannot be blank'})
          }
          else {
            callback({ status: 'success', message: 'restaurant was successfully updated'})
          }  
        })
      })
    } 
  },

}

module.exports = adminController