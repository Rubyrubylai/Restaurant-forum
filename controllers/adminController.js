const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
    getRestaurants: (req, res) => {
        Restaurant.findAll({
            raw: true,
            nest: true,
            include: [Category]
        })
        .then(restaurants => {
            const email = req.user.email
            return res.render('admin/restaurants', { restaurants, email })
        })
    },

    createRestaurant: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        })
        .then(categories => {
            return res.render('admin/create', { categories })
        })
    },

    postRestaurant: (req, res) => {
        const { name, CategoryId, tel, address, opening_hours, description } = req.body
        console.log(req.body)
        if (!name) {
            req.flash('failure_msg', 'name column cannot be blank')
            return res.redirect('back')
        }
        const { file } = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                if (err) console.error(err)
                Restaurant.create({
                    name,
                    CategoryId,
                    tel,
                    address,
                    opening_hours,
                    description,
                    image: file ? img.data.link : null
                })
                .then (restaurant => {
                    req.flash('success_msg', 'restaurant was successfully created.')
                    return res.redirect('/admin')
                })        
            })
        }
        else {
            Restaurant.create({
                name,
                CategoryId,
                tel,
                address,
                opening_hours,
                description,
                image: null
            })
            .then (restaurant => {
                req.flash('success_msg', 'restaurant was successfully created.')
                return res.redirect('/admin')
            })
        }
    },

    getRestaurant: (req, res) => {
        Restaurant.findByPk(
            req.params.id,
            { include: [Category] })
        .then(restaurant => {
            return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
        })
    },

    editRestaurant: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        })
        .then(categories => {
            Restaurant.findByPk(
                req.params.id,
                { include: [Category] }
            )
            .then(restaurant => {
                return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })     
            })
        })
        .catch(err => console.error(err))
    },

    putRestaurant: (req, res) => {
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
                            req.flash('failure_msg', 'name column cannot be blank')
                            return res.redirect('back')
                        }
                        else {
                            req.flash('success_msg', 'restaurant was successfully updated.')
                            return res.redirect('/admin')
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
                        req.flash('failure_msg', 'name column cannot be blank')
                        return res.redirect('back')
                    }
                    else {
                        req.flash('success_msg', 'restaurant was successfully updated.')
                        return res.redirect('/admin')
                    }  
                })
            })
        } 
    },

    deleteRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant.destroy().then(restaurant => {
                return res.redirect('/admin')
            })
        })
    },

    getUsers: (req, res) => {
        User.findAll({
            raw: true,
            nest: true
        })
        .then(users => {
            return res.render('admin/users', { users })
        })
    },

    putUsers: (req, res) => {
        User.findByPk(req.params.id).then(user => {
            if (user.isAdmin) {
                req.flash('success_msg', 'user was successfully updated')
                user.update({
                    isAdmin: false
                })
            }
            else {
                req.flash('success_msg', 'user was successfully updated')
                user.update({
                    isAdmin: true
                })
            }
            return res.redirect('/admin/users')
 
        })
    }
}

module.exports = adminController