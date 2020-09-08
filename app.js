const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const passport = require('./config/passport')

app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false ,
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.failure_msg = req.flash('failure_msg')
    next()
})

require('./routes')(app, passport)

app.listen('3000', () => console.log('app is listening!'))