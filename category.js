const { json } = require('micro')

const { createError } = require('./error')
const Category = require('./models/Category')

const getCategoryById = async (id) => {
  const category = await Category.query().findById(id)

  return category
}

const getCategoryStringQuery = async (req) => {
  const { id, name, minprice, maxprice } = req.query
  // if (!id && !name) throw createError(401, 'Invalid request.')

  const category = await Category
    .query()
    .skipUndefined()
    .where('id', id)
    .andWhere('name', 'like', '%' + name + '%')
    .eager('products.images')
    .modifyEager('products', builder => {
      builder.select('id', 'name', 'price')
        .where('price', '>=', minprice)
        .andWhere('price', '<=', maxprice)
    })
    .modifyEager('products.images', builder => {
      builder.select('id', 'imgUrl')
    })

  return category
}

const getCategoryByName = async (name) => {
  const category = await Category.query().where('name', name)

  return category
}

// Create
const newCategory = async (req, res) => {
  const data = await json(req)
  const { name } = data

  const category = await getCategoryByName(name)
  console.log('categoria: ', category)
  if (category.length > 0) throw createError(401, 'Category already exist.')

  await Category.query().insert({name: name})

  return { message: 'Create successful.' }
}

// Read
const getCategory = async (req, res) => {
  const category = await getCategoryStringQuery(req)

  if (!category) throw createError(404, 'Category not found.')

  if (category.length <= 0) return { message: 'Category not found.' }

  // return result (json) in response
  return category
}

// Update
const updateCategory = async (req, res) => {
  const data = await json(req)
  const { newName } = data
  const { id } = req.query

  if (!id || !newName) throw createError(401, 'Invalid request.')

  // Can't change to same name
  const category = await getCategoryByName(newName)
  if (category.length > 0) throw createError(401, 'Invalid Name.')

  const categoryToUpdate = await getCategoryById(id)
  if (categoryToUpdate.length <= 0) throw createError(404, 'Category not found.')

  await categoryToUpdate.$query().patch({name: newName})

  return { message: 'Update successful.' }
}

// Delete
const deleteCategory = async (req, res) => {
  const { id } = req.query

  if (!id) throw createError(401, 'Invalid request.')

  const category = await getCategoryById(id)
  if (!category || category.length <= 0) throw createError(404, 'Category not found.')

  await category.$query().delete()

  return { message: 'Delete successful.' }
}

module.exports = {
  newCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
}
