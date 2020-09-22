const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

const categoryController  = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, (data) => {
            return res.render('admin/categories', data)
        })
    },

    postCategory: (req, res) => {
        categoryService.postCategory(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('failure_msg', data['message'])
                return res.redirect('back')
            }
            req.flash('success_msg', data['message'])
            return res.redirect('/admin/categories')
        })
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