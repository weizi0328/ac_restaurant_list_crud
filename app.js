
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
  }
})

const app = express()
mongoose.connect(process.env.MONGODB_URI)  // 設定連線到mongoDB

const port = 3000

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

// Setting the route and corresponding response
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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
