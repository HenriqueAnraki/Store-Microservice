const { json, createError } = require('micro')

const Category = require('./models/Category')

const getCategoryByName = async (name) => {
  const category = await Category.query().where('name', name)

  return category
}

const createCategory = async (req, res) => {
  console.log('create')
  const data = await json(req)
  const { name } = data

  const category = await getCategoryByName(name)

  if (category.length > 0) throw createError(401, 'Category already exist.')
  console.log('inserting category')
  await Category.query().insert({name: name})
}

const readCategory = async (req, res) => {

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
