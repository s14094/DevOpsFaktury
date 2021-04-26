const express = require('express')
const redis = require('redis')


const db = require('./db')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const redisClient = redis.createClient({host: "redis", port: 6379})

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })


app.get('/', (req, res) => res.send('Hello World!!!!!'))


app.get('/drop', async (req, res) => {
  await db.schema.dropTableIfExists('users')
  await db.schema.withSchema('public').createTable('users', (table) => {
    table.increments()
    table.string('name')
  })
  res.send();
})


app.get('/users', async (req, res) => {
  redisClient.get('cache_users', async (err, result) => {
    if (!result) {
      const users = await db.select().from('users')
      redisClient.set('cache_users', JSON.stringify(users));
      res.send(users);
    } else {
      console.log('found')
      res.send(result);
    }
  });

  // const operations = await db.select().from('users')
  // res.send(operations);
})

app.post('/users', async (req, res) => {
  console.log(req)
  const user = await db('users').insert({ name: req.body.name }).returning('*')
  res.json(user)
})

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))