const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
    signupPage: (req, res) => {
        return res.render('signup')
    },

    signup: (req, res) => {
        const { name, email, password} = req.body
        var salt = bcrypt.genSaltSync(10)
        User.create({
            name,
            email,
            password: bcrypt.hashSync(password, salt)
        })
        .then(user => {
            return res.redirect('/signin')
        })
    }
}

module.exports = userController