const { router, get, post, patch, del } = require('microrouter')
const { Model } = require('objection')

const { handleErrors } = require('./error')
const category = require('./category')
const product = require('./product')
const image = require('./image')

const Knex = require('knex')
const knexfile = require('./models/knexfile')
const knexConfig = process.env.NODE_ENV || 'development'
const knex = Knex(knexfile[knexConfig])

Model.knex(knex)

// verificar caso com 'id' e 'name'

module.exports = handleErrors(
  router(
    get('/category', category.getCategory),
    post('/category', category.newCategory),
    patch('/category', category.updateCategory),
    del('/category', category.deleteCategory),
    get('/product', product.getProduct),
    post('/product', product.newProduct),
    patch('/product', product.updateProduct),
    del('/product', product.deleteProduct),
    get('/img', image.getImage),
    post('/img', image.saveImage),
    del('/img', image.deleteImage)
  )
)
