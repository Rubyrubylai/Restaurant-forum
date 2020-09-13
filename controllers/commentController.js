const db = require('../models')
const Comment = db.Comment

const commentController = {
    postComment: (req, res) => {
        Comment.create({
            text: req.body.text,
            UserId: req.user.id,
            RestaurantId: req.body.restaurantId
        })
        .then(comment => {
            return res.redirect(`/restaurants/${req.body.restaurantId}`)
        })
    }
}

module.exports = commentController