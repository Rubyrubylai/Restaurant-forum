const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Comment = db.Comment
const Restaurant = db.Restaurant
const Like = db.Like
const Followship = db.Followship
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
                { model: Comment, include: [Restaurant]},
                { model: Restaurant, as: 'FavoritedRestaurants'}
            ] })
        .then(user => {
            const comments = user.Comments.map(c => ({
                ...c.dataValues,
                image: c.Restaurant ? c.Restaurant.dataValues.image : null
            }))
            console.log(user.Comments)
            console.log('--------')
            console.log(comments)
            console.log('--------')
            const set = new Set()
            noRepeatedComment = comments.filter(c => !set.has(c.RestaurantId) ? set.add(c.RestaurantId) : false)
            if(noRepeatedComment.length === 0) {
                noRepeatedComment = []
           } else {
               noRepeatedComment = noRepeatedComment.map(c => {
                   //console.log(c.Restaurant)
                   return {
                   
                   ...c,
                   image: c.Restaurant ? c.Restaurant.dataValues.image : null
                   }
               })  
           }
            

            const favoritedRestaurants = user.FavoritedRestaurants.map(r => ({
                ...r.dataValues
            }))
            console.log(user.FavoritedRestaurants)
            const followers = req.user.Followers
            const followings = req.user.Followings
            return res.render('user', { user: user.toJSON(), favoritedRestaurants, followers, followings, noRepeatedComment })
        })
    },

    //瀏覽其他人的profile
    getOtherUser: (req, res) => {
        User.findByPk(
            req.params.id,
            { include: [Comment, 
                { model: Comment, include: [Restaurant]},
                { model: Restaurant, as: 'FavoritedRestaurants'},
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ] })
        .then(otherUser => {
            const favoritedRestaurants = otherUser.FavoritedRestaurants.map(r => ({
                ...r.dataValues
            }))
            const followers = otherUser.Followers.map(u => ({
                ...u.dataValues
            }))
            const followings = otherUser.Followings.map(u => ({
                ...u.dataValues
            }))
            user = req.user
            return res.render('user', { otherUser: otherUser.toJSON(), favoritedRestaurants, followers, followings })
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
            RestaurantId: req.params.restaurantId
        })
        .then(favorite => {
            return res.redirect('back')
        })
    },

    removeFavorite: (req, res) => {
        Favorite.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        }).then(favorite => {
            favorite.destroy().then(favorite => {
                return res.redirect('back')
            })
        })
    },

    addLike: (req, res) => {
        Like.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
        .then(like => {
            return res.redirect('back')
        })
    },

    removeLike: (req, res) => {
        Like.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
        .then(like => {
            like.destroy().then(like => {
                return res.redirect('back')
            })
        })
    },

    getTopUser: (req, res) => {
        User.findAll({
            include: [{ model: User, as: 'Followers' }]
        })
        .then(users => {
            users = users.map(user => ({
                ...user.dataValues,
                FollowerCount: user.Followers.length,
                isFollowed: user.Followers.map(d => d.id).includes(req.user.id)
            }))
            users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
            return res.render('topUser', { users })
        })
    },

    addFollowing: (req, res) => {
        console.log(req.params.userId)
        Followship.create({
            followerId: req.user.id,
            followingId: req.params.userId
        })
        .then(followship => {
            return res.redirect('back')
        })
    },

    removeFollowing: (req, res) => {
        Followship.findOne({
            followerId: req.user.id,
            followingId: req.params.userId
        })
        .then(followship => {
            followship.destroy().then(followship => {
                return res.redirect('back')
            })
        })
    }
}

module.exports = userController