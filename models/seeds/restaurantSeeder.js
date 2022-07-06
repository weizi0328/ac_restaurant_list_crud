const mongoose = require('mongoose')
const Restaurant = require('../restaurant')  // 載入 restaurant model

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// const db = mongoose.connection

// db.on('error', () => {
//   console.log('mongodb error!')
// })

// db.once('open', () => {
//   console.log('mongodb connected!')
//   for (let i = 0; i < 10; i++) {
//     Restaurant.create({ name: `name-${i}` })
//   }
//   console.log('done')
// })

mongoose.connect('mongodb+srv://alpha:camp@cluster0.2rlpc.mongodb.net/restaurant-list?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then((mongoose) => {
    const db = mongoose.connection
    db.once('open', () => {
      console.log('connected')
      for (let i = 0; i < 10; i++) {
        Restaurant.create({ name: `name-${i}` })
      }
    })
  })
  .catch(error => console.log(error))