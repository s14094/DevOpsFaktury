const knex = require('knex')

module.exports = knex({
  client: 'postgres',
  connection: {
    host: 'db',
    user: 'docker',
    password: 'admin1',
    database: 'docker'
  },
})