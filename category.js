const { json, createError } = require('micro')

const Category = require('./models/Category')

const getCategoryById = async (req) => {
  const {id} = req.query

  if (!id) throw createError(404, 'Category not found.')

  const category = await Category.query().findById(id)
  // .eager('products') -> error: relationMappings do products (duas relaçoes)

  return category
}

const getCategoryByName = async (name) => {
  const category = await Category.query().where('name', name)

  return category
}

const createCategory = async (req, res) => {
  const data = await json(req)
  const { name } = data

  const category = await getCategoryByName(name)

  if (category.length > 0) throw createError(401, 'Category already exist.')

  await Category.query().insert({name: name})
}

const readCategory = async (req, res) => {
  const category = await getCategoryById(req)

  if (!category || category.length <= 0) throw createError(404, 'Category not found.')

  console.log('Category found: ', category)

  // return result (json) in response
  return category
}

const updateCategory = async (req, res) => {

}

const deleteCategory = async (req, res) => {

}

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory
}
