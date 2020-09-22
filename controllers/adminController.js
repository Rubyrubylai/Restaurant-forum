const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService.js')

const adminController = {
    getRestaurants: (req, res) => {
        adminService.getRestaurants(req, res, (data) => {
            return res.render('admin/restaurants', data)
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
        adminService.postRestaurant(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('failure_msg', data['message'])
                return res.redirect('back')
            }
            req.flash('success_msg', data['message'])
            return res.redirect('/admin/restaurants')
        })
    },

    getRestaurant: (req, res) => {
        adminService.getRestaurant(req, res, (data) => {
            return res.render('admin/restaurant', data)
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
        adminService.putRestaurant(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('failure_msg', data['message'])
                return res.redirect('back')
            }
            req.flash('success_msg', data['message'])
            return res.redirect('/admin/restaurants')
            
        })
    },

    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, (data) => {
            if (data['status'] === 'success') {
                return res.redirect('/admin/restaurants')
            }
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