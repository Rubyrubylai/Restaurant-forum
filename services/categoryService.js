const db = require('../models')
const Category = db.Category

const categoryController  = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      const email = req.user.email
      if (req.params.id) {
          Category.findByPk(req.params.id).then(category => {
            callback({ categories, category: category.toJSON(), email })
          })
      }
      else {
        callback({ categories, email })
      } 
    })   
  },

  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: 'name column cannot be blank' })
    }
    else {
      Category.create({
        name
      })
      .then(category => {
        callback({ status: 'success', message: 'category was successfully added' })
      })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'name column cannot be blank' })
    }
    else {
      Category.findByPk(req.params.id).then(category => {
        category.update({
            name: req.body.name
        })
        .then(category => {
          callback({ status: 'success', message: 'category was successfully updated' })
        })
        .catch(err => console.error(err))
      })
    }
  },

  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id).then(category => {
      category.destroy().then(category => {
        callback({ status: 'success', message: `${category.name} was successfully deleted` })
      })
    })
  }
}

module.exports = categoryController