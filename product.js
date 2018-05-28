const { json } = require('micro')

const { createError } = require('./error')
const Product = require('./models/Product')
const { getCategoryById } = require('./category')

const getProductById = async (id) => {
  const product = await Product.query().findById(id)

  return product
}

const getProductByName = async (name) => {
  const product = await Product.query().where('name', name)

  return product
}

const newProduct = async (req, res) => {
  const data = await json(req)
  const { idCategory, name, price } = data

  const product = await getProductByName(name)
  if (product.length > 0) throw createError(401, 'Product already exist.')

  const category = await getCategoryById(idCategory)
  if (!category) throw createError(402, 'Invalid category')

  console.log('insert product')

  await Product.query().insert({name: name, idCategory: idCategory, price: price})

  return { message: 'Create successful.' }
}

const getProduct = async (req, res) => {
  const { id } = req.query

  if (!id) throw createError(401, 'Invalid request.')

  const product = await getProductById(id)

  console.log('product found: ', product)

  if (!product) throw createError(404, 'Product not found.')

  if (product.length <= 0) return { message: 'Product not found' }

  return product
}

const updateProduct = async (req, res) => {
  const data = await json(req)
  const { newIdCategory, newName, newPrice } = data
  const { id } = req.query

  if (!id || !newName || !newIdCategory || !newPrice) throw createError(401, 'Invalid request.')

  const productToUpdate = await getProductById(id)
  if (productToUpdate.length <= 0) throw createError(404, 'Product not found.')

  const product = await getProductByName(newName)
  if (product.length > 0 && id != product[0].id) throw createError(401, 'Invalid Name.')
  // !== não funciona

  const category = await getCategoryById(newIdCategory)
  if (!category) throw createError(402, 'Invalid category')

  await productToUpdate.$query().patch({name: newName, idCategory: newIdCategory, price: newPrice})

  return { message: 'Update successful.' }
}

const deleteProduct = async (req, res) => {
  const { id } = req.query

  if (!id) throw createError(401, 'Invalid request.')

  const product = await getProductById(id)
  if (!product || product.length <= 0) throw createError(404, 'Product not found.')

  await product.$query().delete()

  return { message: 'Delete successful.' }
}

module.exports = {
  getProduct,
  newProduct,
  updateProduct,
  deleteProduct
}
