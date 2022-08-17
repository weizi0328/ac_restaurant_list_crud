const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽所有 Restaurants (首頁)
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurantData => res.render('index', { restaurantData }))
    .catch(error => console.error(error))
})

// Setting the route of search
router.get('/search', (req, res) => {
  if (!req.query.keyword) {
    res.redirect('/')
  }

  const keyword = req.query.keyword
  const keywordClearFormat = req.query.keyword.trim().toLowerCase()

  Restaurant.find()
    .lean()
    .then((restaurantData) => {
      const filterRestaurantData = restaurantData.filter(
        (data) => {
          return (
            data.name.toLowerCase().includes(keywordClearFormat) ||
            data.category.includes(keywordClearFormat)
          )
        })
      res.render('index', { restaurantData: filterRestaurantData, keyword })
    })
    .catch((error) => console.log(error))
})

module.exports = router