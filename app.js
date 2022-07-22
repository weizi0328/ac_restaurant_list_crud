const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const port = 3000
const app = express()

// mongoose 連線
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// 分隔線


// 瀏覽所有 Restaurants (首頁)
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// 新增一筆 restaurant 資料
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  console.log(req.body)
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽特定一筆 restaurant 資料 (detail page)
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurants => res.render('detail', { restaurants }))
    .catch(error => console.log(error))
})

// 修改特定一筆 restaurant 資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const data = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      const columns = ['name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'description']
      for (let i = 0; i < columns.length; i++) {
        restaurant[columns[i]] = data[columns[i]]
      }
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 刪除特定一筆 restaurant 資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
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


// Listen and start the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
