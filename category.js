const { json, createError } = require('micro')

const Category = require('./models/Category')

const getCategoryAndProductsById = async (id) => {
  const category = await Category.query().findById(id).eager('products')

  return category
}

const getCategoryById = async (id) => {
  const category = await Category.query().findById(id)

  return category
}

const getCategoryByName = async (name) => {
  const category = await Category.query().where('name', 'like', '%' + name + '%').eager('products')

  return category
}

const getCategoryStringQuery = async (req) => {
  const { id, name } = req.query

  if (!id && !name) throw createError(404, 'Category not found.')

  if (id) {
    const categoryById = await getCategoryAndProductsById(id)
    return categoryById
  }

  if (name) {
    const categoryByName = await getCategoryByName(name)
    return categoryByName
  }
}

const getCategoryBySpecificName = async (name) => {
  const category = await Category.query().where('name', name)

  return category
}

const newCategory = async (req, res) => {
  const data = await json(req)
  const { name } = data

  const category = await getCategoryBySpecificName(name)

  if (category.length > 0) throw createError(401, 'Category already exist.')

  await Category.query().insert({name: name})

  return { Message: 'Create successful.' }
}

const getCategory = async (req, res) => {
  const category = await getCategoryStringQuery(req)

  if (!category || category.length <= 0) throw createError(404, 'Category not found.')

  console.log('Category found: ', category)

  // return result (json) in response
  return category
}

const updateCategory = async (req, res) => {
  const data = await json(req)
  const { newName } = data
  const { id } = req.query

  if (!id || !newName) throw createError(404, 'Category not found.')

  const category = await getCategoryBySpecificName(newName)
  if (category.length > 0) createError(401, 'Invalid Name.')

  const categoryToUpdate = await getCategoryById(id)
  if (categoryToUpdate.length <= 0) createError(404, 'Category not found.')

  await categoryToUpdate.$query().patch({name: newName})

  return { Message: 'Update successful.' }
}

const deleteCategory = async (req, res) => {
  const { id } = req.query

  if (!id) throw createError(404, 'Category not found.')

  const category = await getCategoryById(id)
  if (category.length <= 0) createError(404, 'Category not found.')

  await category.$query().delete()

  return { Message: 'Delete successful.' }
}

module.exports = {
  newCategory,
  getCategory,
  updateCategory,
  deleteCategory
}
