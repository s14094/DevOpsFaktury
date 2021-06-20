const express = require('express')
const redis = require('redis')
const cors = require('cors')
const keys = require('./keys');

const PORT = 5000
const app = express()
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })
const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  host: keys.pgHost,
  port: keys.pgPort
});

// pgClient.on('error', () => {
//   console.log("Postgres not connected!");
// });

// pgClient.on('connect', () =>{
//   console.log("Connected to Postgres server!");
// });
// console.log("37 linijka");
// app.listen(PORT,  () => {
//   pgClient.
//   query('CREATE TABLE IF NOT EXISTS invoice (id SERIAL PRIMARY KEY, invoice_number VARCHAR(15), invoice_nip VARCHAR(15));').
//   then(() => {
//     console.log(`Server listening on port ${PORT}`);
//   }).
//   catch((err) => {
//     console.log("Error while creating table\n"+err);
//   });
// })

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))

app.get("/api/check", (req, res) => {
  res.send("api works");
});


app.get('/api/recreate', async (req, res) => {
  await db.schema.dropTableIfExists(globals.TABLE_NAME)
  await db.schema.withSchema('public').createTable(globals.TABLE_NAME, (table) => {
    table.increments('id')
    table.string(globals.INV_NUMBER)
    table.integer(globals.INV_NIP)
    console.log('recreated db')
  })
  res.send();
})


app.get('/api/invoice', async (req, res) => {
  const invoices = await db.select().from(globals.TABLE_NAME)
  res.send(invoices);
})

app.put('/api/invoice/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const invoice = await db(globals.TABLE_NAME).where({ id: id }).update({ invoice_number: req.body.number }, ['id', globals.INV_NUMBER, globals.INV_NIP]).returning('*')
  res.json('updated');
})

app.get('/api/invoice/:id', async (req, res) => {
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

app.post('/api/invoice', async (req, res) => {
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

app.del('/api/invoice/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  await db(globals.TABLE_NAME).where({ id: id }).del()
  res.json('deleted');
})