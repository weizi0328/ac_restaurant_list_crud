const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')


// 新增一筆 restaurant 資料
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  console.log(req.body)
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 瀏覽特定一筆 restaurant 資料 (detail page)
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurants => res.render('detail', { restaurants }))
    .catch(error => console.log(error))
})


// 修改特定一筆 restaurant 資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router