const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Comment = db.Comment
const Restaurant = db.Restaurant
const bcrypt = require('bcryptjs')
const passport = require('passport')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
    //註冊頁面
    signupPage: (req, res) => {
        return res.render('signup')
    },

    //註冊
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
    },

    //登入頁面
    signinPage: (req, res) => {
        return res.render('signin')
    },

    //登入
    signin: (req, res, next) => {
        req.flash('success_msg', '成功登入!')
        return res.redirect('/restaurants')
    },

    //登出
    logout: (req, res) => {
        req.flash('success_msg', '成功登出!')
        req.logout()
        return res.redirect('/signin')
    },

    //瀏覽profile
    getUser: (req, res) => {
        User.findByPk(
            req.user.id,
            { include: [Comment, 
                { model: Comment, include: [Restaurant]}
            ] })
        .then(user => {
            return res.render('user', { user: user.toJSON() })
        })
    },

    //瀏覽編輯Profile頁面
    editUser: (req, res) => {
        User.findByPk(req.user.id).then(user => {
            return res.render('editUser', user)
        })
    },

    //編輯Profile
    putUser: (req, res) => {
        const { file } = req
        const { name } = req.body

        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                User.findByPk(req.user.id).then(user => {
                    user.update({
                        name,
                        image: file ? img.data.link : null
                    })
                    .then(user => {
                        if (!name) {
                            req.flash('failure_msg', 'name column cannot be blank')
                            return res.redirect('back')
                        }
                        else {
                            req.flash('success_msg', 'user was successfully updated')
                            return res.redirect(`/users/${req.user.id}`)
                        }
                    })
                })
                
            })
            
        }
        else {
            User.findByPk(req.user.id).then(user => {
                user.update({
                    name,
                    image: user.image
                })
                .then(user => {
                    if (!name) {
                        req.flash('failure_msg', 'name column cannot be blank')
                        return res.redirect('back')
                    }
                    else { 
                        req.flash('success_msg', 'user was successfully updated')
                        return res.redirect(`/users/${req.user.id}`)
                    }              
                })
            })  
        }
    },

    addFavorite: (req, res) => {
        Favorite.create({
            UserId: req.user.id,
            RestaurantId: req.params.id
        })
        .then(favorite => {
            return res.redirect('back')
        })
    },

    removeFavorite: (req, res) => {
        Favorite.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.id
            }
        }).then(favorite => {
            favorite.destroy().then(favorite => {
                return res.redirect('back')
            })
        })
    }
}

module.exports = userController