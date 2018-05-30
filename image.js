const { createError } = require('./error')
const { getProductById } = require('./product')

const Image = require('./models/Image')
const images3 = require('./images3')

const getImage = async (req, res) => {
  const { id, prod } = req.query

  const img = await Image
    .query()
    .skipUndefined()
    .where('id', id)
    .andWhere('idProduct', prod)

  if (img.length <= 0) throw createError(400, 'Image(s) not found.')

  return images3.fetch(img[0].imgUrl)
}

const saveImage = async (req, res) => {
  const fileName = await images3.set(req, res)

  const { prod } = req.query

  if (!prod) throw createError(401, 'Invalid request.')

  console.log(fileName, ', ', prod)

  const img = await Image.query().where({ 'imgUrl': fileName })
  if (img.length > 0) throw createError(401, 'Image already exist.')

  const product = await getProductById(prod)
  if (!product) throw createError(402, 'Invalid product.')

  await Image.query().insert({ idProduct: parseInt(prod), imgUrl: fileName })

  return { message: 'Create successful.' }
}

const deleteImage = async (req, res) => {
  const { id } = req.query

  const img = await Image
    .query()
    .findById(id)

  console.log('img: ', img)
  if (!img) throw createError(400, "Image don't exist.")

  const result = await images3.remove(img.imgUrl)
  console.log('result: ', result)

  // img.$query().delete()
  await Image
    .query()
    .findById(id)
    .delete()

  console.log(img)

  return { message: 'Delete successful.' }
}

module.exports = {
  getImage,
  saveImage,
  deleteImage
}
