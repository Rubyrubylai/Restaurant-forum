const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
    getRestaurants: (req, res) => {
        Restaurant.findAll({
            raw: true,
            nest: true
        })
        .then(restaurants => {
            return res.render('admin/restaurants', { restaurants })
        })
    },

    createRestaurant: (req, res) => {
        return res.render('admin/create')
    },

    postRestaurant: (req, res) => {
        const { name, tel, address, opening_hours, description } = req.body
        if (!name) {
            req.flash('failure_msg', 'name column cannot be blank')
            return res.redirect('back')
        }
        else {
            Restaurant.create({
                name,
                tel,
                address,
                opening_hours,
                description
            })
            .then (restaurant => {
                req.flash('success_msg', 'restaurant was successfully created.')
                return res.redirect('/admin')
            })
        }
    },

    getRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id).then(restaurant => {
            return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
        })
    }
}

module.exports = adminController