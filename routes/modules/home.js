const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const restaurantList = require('../../restaurant.json').results

// 瀏覽所有 Restaurants (首頁)
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})


// Setting the route of search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.filter(function (restaurant) {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

module.exports = router

