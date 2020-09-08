const auth = {
    authenticated : (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/signin')
    },

    authenticatedAdmin : (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                return next()
            }
            return res.redirect('/')
        }
        return res.redirect('/signin')
    }
}

module.exports = auth