const db = require('../models')
const Category = db.Category

const categoryController  = {
    getCategories: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        })
        .then(categories => {
            const email = req.user.email
            if (req.params.id) {
                Category.findByPk(req.params.id).then(category => {
                    return res.render('admin/categories', { categories, category: category.toJSON(), email})
                })
            }
            else {
                return res.render('admin/categories', { categories, email })
            } 
        })   
    },

    postCategory: (req, res) => {
        const { name } = req.body
        if (!name) {
            req.flash('failure_msg', 'name column cannot be blank')
            return res.redirect('back')
        }
        else {
            Category.create({
                name
            })
            .then(category => {
                return res.redirect('/admin/categories')
            })
        }
    },

    putCategory: (req, res) => {
        if (!req.body.name) {
            req.flash('failure_msg', 'name column cannot be blank')
            return res.redirect('back')
        }
        else {
            Category.findByPk(req.params.id).then(category => {
                category.update({
                    name: req.body.name
                })
                .then(category => {
                    return res.redirect('/admin/categories')
                })
                .catch(err => console.error(err))
            })
        }
    },

    deleteCategory: (req, res) => {
        Category.findByPk(req.params.id).then(category => {
            category.destroy().then(category => {
                return res.redirect('/admin/categories')
            })
        })
    }
}

module.exports = categoryController 