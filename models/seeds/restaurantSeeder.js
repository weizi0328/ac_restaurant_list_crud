const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
// const restaurantSeeds = restaurantList['results']

mongoose.connect('mongodb+srv://alpharestaurant:restaurantlist@cluster00.2rlpc.mongodb.net/restaurant-list?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (err) => { console.log('err: ', err) })

// 觀摩 Bess 同學，Seeder 直接載入 restaurant.json 的 results 資料
db.once('open', () => {
  console.log('running restaurantSeeder...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(error => console.log(error))
})