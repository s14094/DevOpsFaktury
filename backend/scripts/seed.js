const db = require('../db')

;(async () => {
  try {
    await db('invoice').insert({ number: 'AVZ init', nip: '2342423' })
    console.log('Added dummy invoice!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()