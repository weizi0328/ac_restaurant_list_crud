const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const restaurantList = require('../../restaurant.json').results



db.once('open', () => {
  console.log('running restaurantSeeder...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(error => console.log(error))
})