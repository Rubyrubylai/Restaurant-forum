const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
    signupPage: (req, res) => {
        return res.render('signup')
    },

    signup: (req, res) => {
        const { name, email, password, passwordCheck} = req.body
        User.findOne({ where: { email: email } }).then(user => {
            if (user) { 
                req.flash('failure_msg', '此帳號已註冊過，請直接登入')
                return res.redirect('/signup')
            }
            else {
                if (password !== passwordCheck) {
                    req.flash('failure_msg', '兩次輸入的密碼不一致')
                    return res.redirect('/signup')
                }
                else {
                    console.log('a')
                    var salt = bcrypt.genSaltSync(10)
                    User.create({
                        name,
                        email,
                        password: bcrypt.hashSync(password, salt)
                    })
                    .then(user => {
                        req.flash('success_msg', '成功註冊，請登入')
                        return res.redirect('/signin')
                    })
                }
            }
        })    
    }
}

module.exports = userController