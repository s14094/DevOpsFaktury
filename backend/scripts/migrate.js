const db = require('../db')
const globals = require('./globals')

  ; (async () => {
    try {
      await db.schema.dropTableIfExists('invoice')
      await db.schema.withSchema('public').createTable('invoice', (table) => {
        table.increments('id')
        table.string(globals.INV_NUMBER)
        table.integer(globals.INV_NIP)
      })
      console.log('Created invoice table!')
      process.exit(0)
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
  })()