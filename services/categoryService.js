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
  }
}

module.exports = categoryController