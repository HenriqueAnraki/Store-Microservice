const { router, get, post, patch, del } = require('microrouter')
const { Model } = require('objection')

const category = require('./category')

const Knex = require('knex')
const knexfile = require('./models/knexfile')
const knexConfig = process.env.NODE_ENV || 'development'
const knex = Knex(knexfile[knexConfig])

Model.knex(knex)

module.exports = router(
  get('/category', category.readCategory),
  post('/category', category.createCategory),
  patch('/category', category.updateCategory),
  del('/category', category.deleteCategory)
)
