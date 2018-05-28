const { router, get, post, patch, del } = require('microrouter')
const { Model } = require('objection')

const category = require('./category')

const Knex = require('knex')
const knexfile = require('./models/knexfile')
const knexConfig = process.env.NODE_ENV || 'development'
const knex = Knex(knexfile[knexConfig])

Model.knex(knex)

module.exports = router(
  get('/category', category.getCategory),
  post('/category', category.newCategory),
  patch('/category', category.updateCategory),
  del('/category', category.deleteCategory)/*,
  get('/product', product.getProduct),
  post('/product', product.newProduct),
  patch('/product', product.updateProduct),
  del('/product', product.deleteProduct),
  get('/img', image.getImage),
  post('/img', image.saveImage),
  del('/img', image.deleteImage)
  */
)
