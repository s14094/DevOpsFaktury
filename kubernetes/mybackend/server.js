const express = require('express')
const redis = require('redis')
const cors = require('cors')
const keys = require('./keys');

console.log("5 linijka");
const PORT = 5000
const app = express()
console.log("8 linijka");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
console.log("13 linijka");
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

redisClient.on('connect', () => { console.log('Connected to the Redis server'); })
console.log("19 linijka");
const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  host: keys.pgHost,
  port: keys.pgPort
});

pgClient.on('error', () => {
  console.log("Postgres not connected!");
});

pgClient.on('connect', () =>{
  console.log("Connected to Postgres server!");
});
console.log("37 linijka");
app.listen(PORT,  () => {
  pgClient.
  query('CREATE TABLE IF NOT EXISTS invoice (id SERIAL PRIMARY KEY, invoice_number VARCHAR(15), invoice_nip VARCHAR(15));').
  then(() => {
    console.log(`Server listening on port ${PORT}`);
  }).
  catch((err) => {
    console.log("Error while creating table\n"+err);
  });
})

app.get("/api/check", (req, res) => {
  res.send("[k8s] API WORKS! (/api)");
});


app.get("/api/invoice", (req, res) => {
  redisClient.get('cached_operations', (err, result) => {
    if (!result) {
      pgClient.
      query('SELECT * FROM invoice;').
      then(result => {
        res.status(200).json(result.rows)
      }).
      catch((err) => {
        res.send(err);
      });
    } else {
      console.log('Found cached_operations in Redis Client');
      res.send(result);
    }
  });
})

app.post("/api/invoice",  (req, res) => {
  const { value, currency } = req.body
  pgClient.
  query('INSERT INTO invoice (value, currency) VALUES ($1, $2) RETURNING id;', [value, currency]).
  then(result => {
    const id = result.rows[0].id;
    addToCache(id, value, currency);
    res.status(200).json(result.rows[0].id)
  }).
  catch((err) => {
    res.send(err);
  });
})
