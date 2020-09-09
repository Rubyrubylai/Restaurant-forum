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
    },

    editRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id).then(restaurant => {
            return res.render('admin/create', { restaurant: restaurant.toJSON() })
        })  
    },

    putRestaurant: (req, res) => {
        const { name, tel, address, opening_hours, description } = req.body    
        Restaurant.findByPk(req.params.id).then(restaurant => {
                restaurant.update({
                    name,
                    tel,
                    address,
                    opening_hours,
                    description
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
                .catch(err => console.error(err))
            
        })
    },

    deleteRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant.destroy().then(restaurant => {
                return res.redirect('/admin')
            })
        })
    }
}

module.exports = adminController