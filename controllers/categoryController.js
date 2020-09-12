const db = require('../models')
const Category = db.Category

const categoryController  = {
    getCategories: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        })
        .then(categories => {
            return res.render('admin/categories', { categories })
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
    }
}

module.exports = categoryController 