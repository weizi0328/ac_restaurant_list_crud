
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

const port = 3000

const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 資料庫相關
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


// Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting static files 設定靜態檔案路由
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

// Setting the route and corresponding response
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// 新增
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  return Restaurant.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// Setting the route of search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(function (restaurant) {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

// Setting the route of "show" page
app.get('/restaurants/:restaurant_id', (req, res) => {
  console.log(req.params.restaurant_id)
  const restaurant = restaurantList.results.find(function (restaurant) {
    return restaurant.id.toString() === req.params.restaurant_id
  })
  res.render('show', { restaurants: restaurant })
})


// Listen and start the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
