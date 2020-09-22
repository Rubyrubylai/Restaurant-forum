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
  }
}

module.exports = categoryController