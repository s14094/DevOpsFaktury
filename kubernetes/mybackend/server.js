const express = require('express')
const redis = require('redis')
const globals = require('./globals')


const db = require('./db')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const redisClient = redis.createClient({ host: "redis", port: 6379 })

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })


app.get('/', (req, res) => res.send('Hello World!!!'))


app.get('/recreate', async (req, res) => {
  await db.schema.dropTableIfExists(globals.TABLE_NAME)
  await db.schema.withSchema('public').createTable(globals.TABLE_NAME, (table) => {
    table.increments('id')
    table.string(globals.INV_NUMBER)
    table.integer(globals.INV_NIP)
    console.log('recreated db')
  })
  res.send();
})


app.get('/invoice', async (req, res) => {
  const invoices = await db.select().from(globals.TABLE_NAME)
  res.send(invoices);
})

app.put('/invoice/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const invoice = await db(globals.TABLE_NAME).where({ id: id }).update({ invoice_number: req.body.number }, ['id', globals.INV_NUMBER, globals.INV_NIP]).returning('*')
  res.json('updated');
})

app.get('/invoice/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  redisClient.get(id, async (err, cacheVal) => {
    if(!cacheVal){
      const invoices = await db.select().from(globals.TABLE_NAME).where('id', id)
      redisClient.set(id, JSON.stringify(invoices))
      res.send(invoices);
    } else {
      res.send(cacheVal);
    }
  })
})

app.post('/invoice', async (req, res) => {
  const invoice = await db(globals.TABLE_NAME).insert({ invoice_number: req.body.number, invoice_nip: req.body.nip }).returning('*')
  var idd;
  for(var i = 0; i < invoice.length; i++)
  {
    idd = invoice[i]['id'];
  }
  const invoiceForCache = {id: idd, invoice_number: req.body.number, invoice_nip: req.body.nip};
  redisClient.get(idd, async (err, cacheVal) => {
    if(!cacheVal){
      redisClient.set(idd, JSON.stringify(invoiceForCache))
    }});
  res.json(invoice)
})

app.del('/invoice/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await db(globals.TABLE_NAME).where({ id: id }).del()
  res.json('deleted');
})



app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))