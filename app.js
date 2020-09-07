const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const db = require('./models')

app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

require('./routes')(app)

app.listen('3000', () => console.log('app is listening!'))